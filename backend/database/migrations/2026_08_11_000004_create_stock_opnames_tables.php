<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_opnames', function (Blueprint $table) {
            $table->id();

            $table->date('tanggal');

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('status')->default('draft');

            $table->text('catatan')->nullable();

            $table->timestamps();
        });

        Schema::create('stock_opname_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('stock_opname_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('item_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->integer('qty_sistem');

            $table->integer('qty_fisik')->nullable();

            $table->integer('selisih')->nullable();

            $table->foreignId('unit_id')
                ->nullable()
                ->constrained('item_units')
                ->nullOnDelete();

            $table->string('alasan')->nullable();

            $table->timestamps();

            $table->unique(['stock_opname_id', 'item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_opname_items');
        Schema::dropIfExists('stock_opnames');
    }
};
