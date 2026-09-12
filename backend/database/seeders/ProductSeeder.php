<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $makanan = Category::where('slug', 'makanan')->first();
        $minuman = Category::where('slug', 'minuman')->first();
        $snack = Category::where('slug', 'snack')->first();
        $dessert = Category::where('slug', 'dessert')->first();

        $products = [
            ['category_id' => $makanan->id, 'name' => 'Nasi Goreng', 'price' => 25000],
            ['category_id' => $makanan->id, 'name' => 'Mie Goreng', 'price' => 23000],
            ['category_id' => $makanan->id, 'name' => 'Ayam Geprek', 'price' => 28000],
            ['category_id' => $minuman->id, 'name' => 'Kopi Susu', 'price' => 18000],
            ['category_id' => $minuman->id, 'name' => 'Kopi Americano', 'price' => 20000],
            ['category_id' => $minuman->id, 'name' => 'Es Teh Manis', 'price' => 8000],
            ['category_id' => $minuman->id, 'name' => 'Jus Alpukat', 'price' => 22000],
            ['category_id' => $snack->id, 'name' => 'Kentang Goreng', 'price' => 15000],
            ['category_id' => $snack->id, 'name' => 'Pisang Goreng', 'price' => 12000],
            ['category_id' => $dessert->id, 'name' => 'Es Krim Vanilla', 'price' => 15000],
        ];

        foreach ($products as $p) {
            Product::create([
                'category_id' => $p['category_id'],
                'name' => $p['name'],
                'slug' => str($p['name'])->slug(),
                'description' => $p['name'] . ' — menu favorit ScanMenu.',
                'price' => $p['price'],
                'is_available' => true,
            ]);
        }
    }
}
