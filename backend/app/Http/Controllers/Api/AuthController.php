<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required'],
        ]);

        $user = User::where('username', $credentials['username'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Username atau password salah',
            ], 401);
        }

        // MULTI-DEVICE: izinkan login dari device mana saja.
        // Token lama otomatis expired setelah 90 menit (safety net lupa logout).
        $token = $user->createToken(
            'auth-token',
            ['*'],
            now()->addMinutes((int) config('sanctum.expiration'))
        );

        $ip = $request->ip();
        $location = self::fetchLocation($ip);

        $token->accessToken->forceFill([
            'ip_address' => $ip,
            'user_agent' => $request->userAgent(),
            'location' => $location,
        ])->save();

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'token' => $token->plainTextToken,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }

    private static function fetchLocation(string $ip): ?string
    {
        // Localhost tidak bisa di-geolocate
        if (in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
            return 'Localhost';
        }

        try {
            $response = Http::timeout(3)
                ->get("http://ip-api.com/json/{$ip}?fields=status,country,regionName,city");

            if ($response->successful() && $response->json('status') === 'success') {
                $parts = array_filter([
                    $response->json('city'),
                    $response->json('regionName'),
                    $response->json('country'),
                ]);

                return implode(', ', $parts) ?: null;
            }
        } catch (\Exception $e) {
            // Geolocation gagal, jangan block login
        }

        return null;
    }
}
