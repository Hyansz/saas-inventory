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
            background: #dbeafe;
            color: #1d4ed8;
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

        .safe {
            color: #166534;
            font-weight: bold;
        }

        .danger {
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
            Laporan Stock Barang
        </div>

        <div class="subtitle">
            Data keseluruhan stock inventory
        </div>

        <div class="badge">
            STOCK REPORT
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Barang</th>
                <th>Kategori</th>
                <th width="15%">Stock</th>
                <th width="15%">Minimal</th>
                <th width="20%">Status</th>
            </tr>
        </thead>

        <tbody>
            @forelse ($items as $item)

                @php
                    $stock =
                        ($item->stock_ins_sum_qty ?? 0)
                        -
                        ($item->stock_outs_sum_qty ?? 0);
                @endphp

                <tr>
                    <td>{{ $item->nama_barang }}</td>

                    <td>{{ $item->category?->name }}</td>

                    <td>{{ $stock }}</td>

                    <td>{{ $item->stok_minimal }}</td>

                    <td>
                        @if ($stock <= $item->stok_minimal)
                            <span class="danger">
                                Stock Menipis
                            </span>
                        @else
                            <span class="safe">
                                Aman
                            </span>
                        @endif
                    </td>
                </tr>

            @empty
                <tr>
                    <td colspan="5" style="text-align:center;">
                        Tidak ada data
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Total Barang:
        {{ $items->count() }}
    </div>

</body>

</html>