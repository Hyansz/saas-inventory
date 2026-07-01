<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">

    <style>
        * {
            font-family: DejaVu Sans, sans-serif;
        }

        body {
            font-size: 12px;
            color: #18181b;
            margin: 30px;
        }

        .header {
            border-bottom: 2px solid #18181b;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }

        .title {
            font-size: 24px;
            font-weight: bold;
        }

        .subtitle {
            margin-top: 6px;
            color: #52525b;
            font-size: 13px;
        }

        .badge {
            display: inline-block;
            padding: 6px 12px;
            background: #ede9fe;
            color: #5b21b6;
            border-radius: 999px;
            font-size: 11px;
            font-weight: bold;
            margin-top: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 24px;
        }

        th {
            background: #18181b;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 11px;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e4e4e7;
        }

        tr:nth-child(even) {
            background: #fafafa;
        }

        .type-in {
            color: #166534;
            font-weight: bold;
        }

        .type-out {
            color: #dc2626;
            font-weight: bold;
        }

        .footer {
            margin-top: 24px;
            font-size: 12px;
            color: #52525b;
        }
    </style>
</head>

<body>

    <div class="header">
        <div class="title">
            Laporan History Transaksi
        </div>

        <div class="subtitle">
            Periode:
            {{ $startDate ?: '-' }}
            sampai
            {{ $endDate ?: '-' }}
        </div>

        <div class="badge">
            TRANSACTION HISTORY
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th width="20%">Tanggal</th>
                <th>Barang</th>
                <th width="20%">Tipe</th>
                <th width="15%">Qty</th>
            </tr>
        </thead>

        <tbody>
            @forelse ($transactions as $trx)
                <tr>
                    <td>
                        {{ $trx->tanggal }}
                    </td>

                    <td>
                        {{ $trx->item?->nama_barang }}
                    </td>

                    <td>
                        @if ($trx->type === 'IN')
                            <span class="type-in">
                                STOCK IN
                            </span>
                        @else
                            <span class="type-out">
                                STOCK OUT
                            </span>
                        @endif
                    </td>

                    <td>
                        {{ $trx->qty }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align:center;">
                        Tidak ada data transaksi
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Total Transaksi:
        {{ $transactions->count() }}
    </div>

</body>

</html>