# Figma Capture Localhost

Capture màn hình prototype đang chạy trên localhost và convert sang Figma với độ chính xác 100%. Không cần vẽ lại bằng components - tool sẽ chụp trực tiếp HTML/CSS render.

## Skill Invocation Behavior

**When invoked without arguments** (user types `/figma-capture-localhost` with no context):

The skill MUST use `AskUserQuestion` to gather the following required inputs interactively **in Vietnamese**:

1. **Localhost URL** - The full URL where the prototype is currently running
   - Question: `"URL localhost đang chạy prototype là gì?"`
   - Example: `http://localhost:4204/goal/phieu-muc-tieu`
   - Validation: Must be a localhost or local IP URL (127.0.0.1, 0.0.0.0, *.local)
   - Error message: `"❌ URL phải là localhost hoặc IP local (ví dụ: http://localhost:4204, http://127.0.0.1:3000)"`

2. **Figma File URL** - Target Figma design file URL (must already exist)
   - Question: `"URL Figma file đích là gì? (file phải đã tồn tại)"`
   - Example: `https://www.figma.com/design/MlhpvWhNES6pCCCP045bWL/`
   - Validation: Must match pattern `https://figma.com/design/{fileKey}/...` or `https://www.figma.com/design/{fileKey}/...`
   - Error message: `"❌ URL phải có format: https://figma.com/design/ABC123/... (URL design file, không phải board hay slides)"`
   - Extract `fileKey` from URL path

3. **Page Name** (optional) - Name for the new page to create in Figma
   - Question: `"Tên page mới trong Figma? (bỏ trống để tự động tạo)"`
   - Example: `"Phiếu mục tiêu của tôi - Capture"`
   - Validation: None (optional field)
   - If not provided, auto-generate from URL path or timestamp

**When invoked with context** (user provides details in the prompt):

Parse the provided information first. For each missing or invalid input:

1. **Check if input is provided** in the prompt
2. **Validate the input** according to rules above
3. **If missing or invalid**, use `AskUserQuestion` to request the specific missing/invalid field **in Vietnamese** with the error message explaining what's wrong

Example validation scenarios:

```typescript
// Scenario 1: Missing localhost URL
if (!localhostUrl) {
  askUser("❌ Thiếu URL localhost. URL localhost đang chạy prototype là gì?");
}

// Scenario 2: Invalid localhost URL (external URL provided)
if (!isLocalhost(localhostUrl)) {
  askUser("❌ URL phải là localhost hoặc IP local, không phải external URL. Vui lòng cung cấp URL localhost (ví dụ: http://localhost:4204)");
}

// Scenario 3: Missing Figma file URL
if (!figmaUrl) {
  askUser("❌ Thiếu URL Figma file. URL Figma file đích là gì? (file phải đã tồn tại)");
}

// Scenario 4: Invalid Figma URL (board or slides URL provided)
if (!isFigmaDesignUrl(figmaUrl)) {
  askUser("❌ URL Figma không đúng format. Vui lòng cung cấp URL design file (https://figma.com/design/ABC123/...), không phải board hay slides");
}
```

**Input Validation Helpers:**

```typescript
function isLocalhost(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|.*\.local)(:\d+)?/.test(url);
}

function isFigmaDesignUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?figma\.com\/design\/[^\/]+/.test(url);
}
```

## Khi nào dùng skill này

✅ **Dùng khi:**
- Có prototype React/Angular/Vue đang chạy localhost
- Muốn đưa UI đã code vào Figma để review/handoff
- Cần sync design với implementation hiện tại
- Muốn capture 100% accurate (colors, spacing, fonts, data)

❌ **Không dùng khi:**
- Chưa có code (dùng figma-generate-design để build từ components)
- Muốn tạo design mới từ đầu
- Cần design system components có thể reuse

## Input cần thiết

Khi gọi skill, cung cấp:

```
1. URL localhost đang chạy (VD: http://localhost:4204/goal/phieu-muc-tieu)
2. Figma file URL đích (VD: https://figma.com/design/ABC123...)
3. (Optional) Tên page mới trong Figma
```

## Output

Skill trả về:

- ✅ Node ID của capture trong Figma
- ✅ Link trực tiếp đến selection
- ✅ Screenshot preview
- ✅ Layer structure đã organize

## Workflow bên trong

### Step 1: Gather Inputs (if not provided)

```typescript
// If invoked without context, use AskUserQuestion
const inputs = await AskUserQuestion({
  questions: [
    {
      question: "What is the localhost URL where your prototype is running?",
      header: "Localhost URL",
      options: [
        { label: "http://localhost:3000", description: "Common React/Next.js default" },
        { label: "http://localhost:4200", description: "Common Angular default" },
        { label: "http://localhost:5173", description: "Common Vite default" },
        { label: "http://localhost:8080", description: "Common Vue/webpack default" }
      ],
      multiSelect: false
    },
    {
      question: "What is the absolute path to the component source file?",
      header: "Source Path",
      options: [
        { label: "Browse for file", description: "I'll provide the full path" }
      ],
      multiSelect: false
    },
    {
      question: "What is your target Figma file URL?",
      header: "Figma File",
      options: [
        { label: "I have a Figma file URL", description: "Paste the full URL" }
      ],
      multiSelect: false
    }
  ]
});
```

### Step 2: Validate Prerequisites

1. **Check dev server** - Verify localhost đang chạy
   ```bash
   curl -I ${localhostUrl}
   # Should return 200 OK
   ```

2. **Inject capture script** - Thêm script tag vào HTML (nếu chưa có)
   ```bash
   grep "capture.js" index.html
   # If not found, add: <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
   ```

### Step 3: Execute Capture

3. **Generate capture ID** - Tool tạo unique ID
   ```javascript
   // Call generate_figma_design with fileKey only (no captureId)
   const result = await generate_figma_design({ fileKey, nodeId });
   // Returns: { captureId, captureScript }
   ```

4. **Open browser** - Mở URL với hash parameters
   ```
   User must manually open: ${localhostUrl}#figma-capture-id=${captureId}
   ```

5. **Wait & Poll** - Đợi capture hoàn tất (5-10s)
   ```javascript
   // Poll every 5 seconds, max 10 times
   for (let i = 0; i < 10; i++) {
     await sleep(5000);
     const status = await generate_figma_design({ fileKey, captureId });
     if (status.status === 'completed') break;
   }
   ```

### Step 4: Post-Process

6. **Organize layers** - Rename layers cho dễ đọc
   ```javascript
   // Use use_figma to rename layers based on semantic meaning
   // E.g., "Frame 123" → "Sidebar (Dark)", "Content Area"
   ```

7. **Return link** - Gửi Figma URL về
   ```
   https://www.figma.com/design/${fileKey}?node-id=${capturedNodeId}
   ```

## Ví dụ prompt

### Prompt cơ bản

```
Capture màn hình "Phiếu mục tiêu của tôi" đang chạy tại:
http://localhost:4204/goal/phieu-muc-tieu

Đưa vào Figma file: https://www.figma.com/design/MlhpvWhNES6pCCCP045bWL/
Tạo page mới tên: "Phiếu mục tiêu - Capture"
```

### Prompt chi tiết

```
Tôi có màn hình Dashboard đang chạy tại http://localhost:3000/dashboard

Capture toàn bộ màn hình (có sidebar + header + cards) và đưa vào Figma:
https://figma.com/design/XYZ789/My-Project

Yêu cầu:
- Tạo page mới tên "Dashboard - v1.2"
- Organize layers theo: Header / Sidebar / Main Content
- Screenshot để tôi xem trước
```

## Troubleshooting

### Lỗi "Port không chạy"
```bash
# Check port
netstat -ano | findstr :4204

# Start dev server nếu chưa chạy
cd E:\project
npm run dev
```

### Lỗi "Capture script chưa inject"
Skill sẽ tự động thêm script tag vào `index.html`:
```html
<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
```

Nếu lỗi, check file đã có script chưa.

### Lỗi "Capture timeout"
- Đợi lâu hơn (10 polls)
- Check browser đã mở URL đúng chưa
- Verify hash parameters trong URL

## Giới hạn

- ⚠️ Chỉ hoạt động với **localhost** hoặc **IP local** (127.0.0.1, 0.0.0.0, *.local)
- ⚠️ External URLs cần dùng Playwright MCP (cài riêng)
- ⚠️ Capture ID **single-use** - mỗi trang cần 1 ID mới
- ⚠️ Phải có Figma file **đã tạo sẵn** (skill không tạo file mới)

## Advanced: Capture nhiều pages

```javascript
// Gọi skill nhiều lần song song
1. Capture /dashboard → page "Dashboard"
2. Capture /settings → page "Settings"  
3. Capture /profile → page "Profile"

// Mỗi lần = 1 capture ID riêng
```

## So sánh với VDS Components approach

| | Capture (skill này) | VDS Components |
|---|---|---|
| Độ chính xác | 100% (pixel-perfect) | ~85% (manual build) |
| Thời gian | 5-10 giây | 5-10 phút |
| Editable | Frames (flatten) | Component instances |
| Reusable | ❌ | ✅ |
| Use case | Sync code→Figma | Build design mới |

## Xem thêm

- [figma-generate-design](../figma-generate-design/) - Build từ design system
- [figma-use](../figma-use/) - Script Figma Plugin API
- [Figma MCP Setup](#setup-figma-mcp) - Hướng dẫn cài đặt MCP
