<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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

        // Simpan info device supaya super admin bisa monitor
        $token->accessToken->forceFill([
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
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
}
