# Puppeteer HTML-to-Image API v2

Production-ready HTML to Image conversion using Puppeteer.

## 🚀 Deploy to Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. New Project → Deploy from GitHub
4. Select this repo
5. Railway auto-deploys
6. Generate domain in Settings → Networking

## 📡 API Usage

### POST /screenshot

**Request:**
```json
{
  "html": "<!DOCTYPE html><html>...</html>",
  "width": 1080,
  "height": 1080,
  "format": "png"
}
```

**Response:**
```json
{
  "success": true,
  "image": "data:image/png;base64,...",
  "base64": "iVBORw0KGgo..."
}
```

## 🔧 n8n Integration

**HTTP Request Node:**
- Method: POST
- URL: `https://your-app.railway.app/screenshot`
- Body:
```json
{
  "html": "{{ $json.html }}",
  "width": 1080,
  "height": 1080,
  "format": "png"
}
```

## 💰 Cost

- **Railway**: FREE (500 hours/month)
- **Unlimited images**
- No API limits

## 🐛 Troubleshooting

If deployment fails:
1. Check Railway logs
2. Ensure Node.js >= 18
3. Verify Puppeteer installed correctly
