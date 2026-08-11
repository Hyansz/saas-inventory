<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_ins', function (Blueprint $table) {
            $table->foreignId('unit_id')
                ->nullable()
                ->after('qty')
                ->constrained('item_units')
                ->nullOnDelete();

            $table->decimal('qty_unit', 12, 4)
                ->nullable()
                ->after('unit_id');
        });

        Schema::table('stock_outs', function (Blueprint $table) {
            $table->foreignId('unit_id')
                ->nullable()
                ->after('qty')
                ->constrained('item_units')
                ->nullOnDelete();

            $table->decimal('qty_unit', 12, 4)
                ->nullable()
                ->after('unit_id');
        });

        Schema::table('inventory_transactions', function (Blueprint $table) {
            $table->foreignId('unit_id')
                ->nullable()
                ->after('qty')
                ->constrained('item_units')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('stock_ins', function (Blueprint $table) {
            $table->dropConstrainedForeignId('unit_id');
            $table->dropColumn('qty_unit');
        });

        Schema::table('stock_outs', function (Blueprint $table) {
            $table->dropConstrainedForeignId('unit_id');
            $table->dropColumn('qty_unit');
        });

        Schema::table('inventory_transactions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('unit_id');
        });
    }
};
