<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('stock_ins', function (Blueprint $table) {

            $table->foreignId('transaction_id')
                ->nullable()
                ->after('id')
                ->constrained('inventory_transactions')
                ->nullOnDelete();
        });

        Schema::table('stock_outs', function (Blueprint $table) {

            $table->foreignId('transaction_id')
                ->nullable()
                ->after('id')
                ->constrained('inventory_transactions')
                ->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('stock_ins', function (Blueprint $table) {

            $table->dropConstrainedForeignId('transaction_id');
        });

        Schema::table('stock_outs', function (Blueprint $table) {

            $table->dropConstrainedForeignId('transaction_id');
        });
    }
};
