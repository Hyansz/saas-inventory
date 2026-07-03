<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            [
                'name' => 'Super Admin',
                'username' => 'superadmin',
                'email' => 'superadmin@gmail.com',
                'password' => Hash::make('bismillah123'),
                'role' => 'super_admin',
            ]
        );

        User::updateOrCreate(
            [
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            [
                'name' => 'Manager',
                'username' => 'manager',
                'email' => 'manager@gmail.com',
                'password' => Hash::make('bismillah123'),
                'role' => 'manager',
            ]
        );
    }
}
