<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin ScanMenu',
            'email' => 'admin@scanmenu.test',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Kasir ScanMenu',
            'email' => 'kasir@scanmenu.test',
            'password' => Hash::make('password123'),
            'role' => 'cashier',
        ]);

        User::create([
            'name' => 'Kitchen ScanMenu',
            'email' => 'kitchen@scanmenu.test',
            'password' => Hash::make('password123'),
            'role' => 'kitchen',
        ]);
    }
}