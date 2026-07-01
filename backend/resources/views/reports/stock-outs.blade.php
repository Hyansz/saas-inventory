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
            background: #fee2e2;
            color: #991b1b;
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
            Laporan Barang Keluar
        </div>

        <div class="subtitle">
            Periode:
            {{ $startDate }}
            sampai
            {{ $endDate }}
        </div>

        <div class="badge">
            STOCK OUT REPORT
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th width="20%">Tanggal</th>
                <th>Barang</th>
                <th>Tujuan</th>
                <th width="15%">Qty</th>
            </tr>
        </thead>

        <tbody>
            @forelse ($stockOuts as $item)
                <tr>
                    <td>{{ $item->tanggal }}</td>

                    <td>{{ $item->item?->nama_barang }}</td>

                    <td>{{ $item->tujuan }}</td>

                    <td>{{ $item->qty }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align:center;">
                        Tidak ada data
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Total Data:
        {{ $stockOuts->count() }}
    </div>

</body>

</html>