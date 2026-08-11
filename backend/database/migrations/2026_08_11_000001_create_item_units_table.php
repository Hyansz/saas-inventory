<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_units', function (Blueprint $table) {
            $table->id();

            $table->foreignId('item_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('nama_unit');

            $table->decimal('konversi', 12, 4);

            $table->boolean('is_base')->default(false);

            $table->timestamps();

            $table->unique(['item_id', 'nama_unit']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_units');
    }
};
