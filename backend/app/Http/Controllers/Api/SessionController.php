<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function index()
    {
        $users = User::whereHas('tokens')
            ->with(['tokens' => function ($query) {
                $query->latest();
            }])
            ->get(['id', 'name', 'username', 'email', 'role']);

        $result = $users->map(function ($user) {
            $latestToken = $user->tokens->first();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'logged_in_at' => $latestToken?->created_at,
                'last_used_at' => $latestToken?->last_used_at,
            ];
        });

        return response()->json($result);
    }

    public function forceLogout(User $user)
    {
        $user->tokens()->delete();

        return response()->json([
            'message' => "Berhasil logout paksa akun {$user->name}",
        ]);
    }
}
