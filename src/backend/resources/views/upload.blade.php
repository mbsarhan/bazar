<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Video for Ad</title>
    <style>
        body { font-family: sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; flex-direction: column; }
        .container { max-width: 500px; width: 100%; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 20px; text-align: center; }
        label { display: block; margin-bottom: 8px; font-weight: bold; }
        input[type="file"] { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 20px; }
        button { width: 100%; padding: 12px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
        button:hover { background-color: #0056b3; }
        .alert { padding: 15px; margin-bottom: 20px; border-radius: 4px; }
        .alert-danger { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>

    <div class="container">
        <h1>Upload Video</h1>
        <p>For Advertisement: <strong>#{{ $advertisement->id }} - {{ $advertisement->title }}</strong></p>

        {{-- Display validation errors if they exist --}}
        @if ($errors->any())
            <div class="alert alert-danger">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        
        {{-- The Upload Form --}}
        <form action="{{ route('video.store', ['advertisement' => $advertisement->id]) }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div>
                <label for="video">Choose Video File (Max 20MB)</label>
                <input type="file" id="video" name="video" required>
            </div>
            <button type="submit">Upload and Process Video</button>
        </form>
    </div>

</body>
</html>