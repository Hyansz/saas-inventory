<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller
{
    public function index()
    {
        $tokens = DB::table('personal_access_tokens')
            ->join('users', 'users.id', '=', 'personal_access_tokens.tokenable_id')
            ->where('personal_access_tokens.expires_at', '>', now())
            ->where('personal_access_tokens.tokenable_type', 'App\\Models\\User')
            ->select(
                'personal_access_tokens.id as token_id',
                'users.id as user_id',
                'users.name',
                'users.username',
                'users.email',
                'users.role',
                'personal_access_tokens.ip_address',
                'personal_access_tokens.user_agent',
                'personal_access_tokens.location',
                'personal_access_tokens.created_at as logged_in_at',
                'personal_access_tokens.last_used_at',
            )
            ->orderBy('personal_access_tokens.created_at', 'desc')
            ->get()
            ->map(function ($row) {
                $device = self::parseUserAgent($row->user_agent);

                return [
                    'token_id' => $row->token_id,
                    'user_id' => $row->user_id,
                    'name' => $row->name,
                    'username' => $row->username,
                    'email' => $row->email,
                    'role' => $row->role,
                    'ip_address' => $row->ip_address ?? '-',
                    'location' => $row->location ?? '-',
                    'device' => $device['device'],
                    'browser' => $device['browser'],
                    'os' => $device['os'],
                    'logged_in_at' => $row->logged_in_at,
                    'last_used_at' => $row->last_used_at,
                ];
            });

        return response()->json($tokens);
    }

    public function forceLogoutToken($tokenId)
    {
        $deleted = DB::table('personal_access_tokens')
            ->where('id', $tokenId)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'message' => 'Sesi tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'message' => 'Berhasil logout sesi ini',
        ]);
    }

    public function forceLogout(User $user)
    {
        $user->tokens()->delete();

        return response()->json([
            'message' => "Berhasil logout paksa semua sesi akun {$user->name}",
        ]);
    }

    private static function parseUserAgent(?string $ua): array
    {
        if (!$ua) {
            return ['device' => '-', 'browser' => '-', 'os' => '-'];
        }

        // OS
        $os = '-';
        if (str_contains($ua, 'Windows')) $os = 'Windows';
        elseif (str_contains($ua, 'Mac OS')) $os = 'macOS';
        elseif (str_contains($ua, 'Linux') && !str_contains($ua, 'Android')) $os = 'Linux';
        elseif (str_contains($ua, 'Android')) $os = 'Android';
        elseif (str_contains($ua, 'iPhone') || str_contains($ua, 'iPad')) $os = 'iOS';

        // Browser
        $browser = '-';
        if (str_contains($ua, 'Edg/')) $browser = 'Edge';
        elseif (str_contains($ua, 'OPR/') || str_contains($ua, 'Opera')) $browser = 'Opera';
        elseif (str_contains($ua, 'Chrome') && !str_contains($ua, 'Edg')) $browser = 'Chrome';
        elseif (str_contains($ua, 'Firefox')) $browser = 'Firefox';
        elseif (str_contains($ua, 'Safari') && !str_contains($ua, 'Chrome')) $browser = 'Safari';

        // Device type
        $device = 'Desktop';
        if (str_contains($ua, 'Mobile') || str_contains($ua, 'Android')) $device = 'Mobile';
        elseif (str_contains($ua, 'iPad') || str_contains($ua, 'Tablet')) $device = 'Tablet';

        return ['device' => $device, 'browser' => $browser, 'os' => $os];
    }
}
