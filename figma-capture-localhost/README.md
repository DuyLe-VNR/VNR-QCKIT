# Setup Guide: Figma MCP + Capture Localhost Skill

Hướng dẫn chi tiết từ cài đặt đến sử dụng skill capture localhost sang Figma.

---

## 📦 Bước 1: Cài đặt Figma MCP Server

### 1.1. Kiểm tra MCP có sẵn chưa

Trong Claude Code, gõ:
```
/mcp
```

Nếu thấy `figma` trong danh sách → **Đã có**, nhảy sang Bước 2.

Nếu chưa → Cài mới:

### 1.2. Cài Figma MCP

Chạy trong terminal:

```bash
# Windows PowerShell
npx @figma/mcp install

# hoặc dùng npm global
npm install -g @figma/mcp
figma-mcp install
```

Tool sẽ tự động:
- Thêm Figma MCP vào `~/.claude/mcp_settings.json`
- Download binary cần thiết
- Setup auth flow

---

## 🔐 Bước 2: Xác thực Figma

### 2.1. Mở authentication

Trong Claude Code:
```
/mcp
```

Chọn `figma` → Click **Authenticate**

### 2.2. Login Figma

Browser sẽ mở → Login tài khoản Figma của bạn → Cho phép access.

### 2.3. Verify kết nối

Sau khi auth, trong Claude Code gõ:
```
Figma MCP đã kết nối chưa?
```

Agent sẽ test bằng cách gọi `whoami` tool. Nếu trả về user info → **Thành công**.

---

## 📂 Bước 3: Tạo Figma File đích

⚠️ **Quan trọng:** Skill cần file Figma **đã tồn tại** - không tự tạo file mới.

### Cách 1: Tạo qua UI

1. Vào https://figma.com
2. Click **New design file**
3. Đặt tên (VD: "VNR HRM Prototype")
4. Copy URL: `https://figma.com/design/ABC123XYZ/...`

### Cách 2: Tạo bằng Claude Code

```
Tạo Figma file mới tên "VNR HRM Prototype" trong team "VNR Solution"
```

Agent sẽ dùng `create_new_file` tool.

---

## 🎯 Bước 4: Sử dụng Skill

### 4.1. Prompt đơn giản nhất (Interactive Mode)

Gõ trong Claude Code:
```
/figma-capture-localhost
```

Skill sẽ hỏi từng bước **bằng tiếng Việt**:

1. ❓ **URL localhost đang chạy prototype là gì?**
   - Ví dụ: `http://localhost:4204/goal/phieu-muc-tieu`

2. ❓ **URL Figma file đích là gì? (file phải đã tồn tại)**
   - Ví dụ: `https://figma.com/design/MlhpvWhNES6pCCCP045bWL/`

3. ❓ **Tên page mới trong Figma? (bỏ trống để tự động tạo)**
   - Ví dụ: `"Phiếu mục tiêu - Capture"` hoặc để trống

Skill sẽ **validate từng input** và báo lỗi nếu sai format:

- ❌ URL phải là localhost (không được external URL)
- ❌ Figma URL phải là design file (không phải board/slides)

---

### 4.2. Prompt mẫu 1: Cơ bản (Inline Mode)

```
Capture màn hình đang chạy tại http://localhost:4204/goal/phieu-muc-tieu
và đưa vào Figma: https://figma.com/design/MlhpvWhNES6pCCCP045bWL/

Tạo page mới tên "Phiếu mục tiêu của tôi"
```

### 4.3. Prompt mẫu 2: Chi tiết (Full Context)

```
Tôi có trang Dashboard đang chạy tại:
URL: http://localhost:3000/dashboard

Capture và đưa vào Figma file:
https://figma.com/design/ABC123/My-App

Yêu cầu:
- Page name: "Dashboard - Desktop 1440px"
- Cuộn xuống hết trang trước khi capture
- Gửi link selection để tôi xem
```

### 4.4. Prompt mẫu 3: Capture ảnh tham chiếu

```
Đây là màn hình "Phiếu mục tiêu của tôi":
- URL: http://localhost:4204/goal/phieu-muc-tieu
- Code: E:\vnrsolution\specs\...\PhieuMucTieuCuaToi\index.tsx
- Ảnh tham khảo: [đính kèm ảnh]

Capture sang Figma: https://figma.com/design/XYZ/Đánh-giá

So sánh capture với ảnh tham khảo - báo nếu khác biệt.
```

---

## ✅ Bước 5: Kiểm tra kết quả

Sau khi skill chạy xong, bạn nhận được:

```
✅ Hoàn tất capture

📍 Link: https://www.figma.com/design/ABC?node-id=1234-5678
🎨 Page: "Phiếu mục tiêu của tôi - Localhost Capture"
📐 Size: 1440 × 927px
📦 Layers:
  - Sidebar (Dark): 260px
  - Content Area: 1660px
```

Click link → Mở Figma → Kiểm tra capture.

---

## 🐛 Troubleshooting

### Lỗi 1: "MCP server not found"

**Nguyên nhân:** Figma MCP chưa cài hoặc chưa chạy.

**Fix:**
```bash
# Restart Claude Code
# Hoặc check MCP settings
cat ~/.claude/mcp_settings.json
```

Phải thấy:
```json
{
  "mcpServers": {
    "figma": {
      "command": "...",
      ...
    }
  }
}
```

---

### Lỗi 2: "Authentication required"

**Nguyên nhân:** Token Figma hết hạn.

**Fix:**
```
/mcp → figma → Re-authenticate
```

---

### Lỗi 3: "Port 4204 not running"

**Nguyên nhân:** Dev server chưa chạy.

**Fix:**
```bash
cd E:\vnrsolution\specs\...\prototype
npm run dev
# hoặc
pnpm dev
```

Check port:
```bash
netstat -ano | findstr :4204
```

---

### Lỗi 4: "Capture timeout"

**Nguyên nhân:** Script chưa inject hoặc page load chậm.

**Fix:**

1. Check `index.html` có script chưa:
```html
<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
```

2. Tăng delay:
```
Capture với delay 3000ms (thay vì 1000ms mặc định)
```

---

### Lỗi 5: "File key invalid"

**Nguyên nhân:** URL Figma sai format.

**Đúng:**
```
https://figma.com/design/ABC123XYZ/File-Name
```

**Sai:**
```
https://figma.com/file/ABC123...  ❌
https://figma.com/board/...       ❌ (FigJam)
```

---

## 📚 FAQ

### Q: Capture có bị mất data không?

**A:** Không. Capture là screenshot từ browser render - giữ nguyên mọi thứ đang hiển thị (text, images, colors, spacing).

---

### Q: Có thể edit sau khi capture không?

**A:** Có. Layers trong Figma vẫn là frames/groups bình thường - edit được. Nhưng **không còn là components** - nếu cần reuse thì phải convert thủ công.

---

### Q: Capture nhiều pages cùng lúc?

**A:** Gọi skill nhiều lần:
```
1. Capture /page1 → page "Page 1"
2. Capture /page2 → page "Page 2"
```

Mỗi capture = 1 call riêng (vì mỗi page cần 1 capture ID unique).

---

### Q: Có thể capture external site (VD: google.com)?

**A:** Không bằng skill này (chỉ localhost). Muốn capture external → cần **Playwright MCP** (cài riêng).

---

### Q: Capture có giữ responsive không?

**A:** Capture theo viewport hiện tại. Muốn responsive → capture nhiều lần với viewports khác nhau:
```
1. Capture desktop 1440px
2. Capture tablet 768px
3. Capture mobile 375px
```

---

## 🎓 Best Practices

### 1. Đặt tên page rõ ràng

❌ **Tệ:**
```
"Screen 1"
"Capture 2024"
```

✅ **Tốt:**
```
"Dashboard - Desktop 1440px - v1.2"
"Phiếu mục tiêu - Mobile 375px"
```

---

### 2. Organize layers ngay sau capture

Skill đã rename tự động nhưng có thể refine thêm:
- Group related sections
- Rename cards → "Goal Card 1", "Goal Card 2"...
- Add annotations nếu cần

---

### 3. Version control trong Figma

Mỗi lần update code → capture lại → tạo page mới:
```
"Dashboard - v1.0 - 2024-05-15"
"Dashboard - v1.1 - 2024-05-20"
"Dashboard - v1.2 - 2024-05-25"
```

So sánh versions dễ dàng.

---

### 4. Comment trên Figma

Sau capture, add comments:
- "✅ Match implementation 100%"
- "⚠️ Button color khác spec"
- "📝 Cần review spacing"

Team PD/QC comment trực tiếp trên capture.

---

## 🔗 Resources

- [Figma MCP Docs](https://github.com/figma/mcp)
- [Claude MCP Guide](https://docs.anthropic.com/mcp)
- [Figma Plugin API](https://figma.com/plugin-docs/)

---

## 📝 Changelog

- **2024-06-15:** Initial release
- Support localhost capture
- Auto layer organization
- Screenshot preview
