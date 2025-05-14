import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

// Metadata cho hình ảnh
export const alt = 'Kinh Đô Cá Cảnh - Chuyên cung cấp các loại cá cảnh, thủy sinh, phụ kiện và thức ăn cho cá'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Hàm tạo hình ảnh
export default async function Image() {
  try {
    // Đọc logo từ thư mục public
    const logoData = await readFile(join(process.cwd(), 'public/logos/kinhdocacanh-logo-full.png'))
    
    // Chuyển đổi dữ liệu thành Base64 để có thể sử dụng trong src
    const logoBase64 = Buffer.from(logoData).toString('base64')
    const logoSrc = `data:image/png;base64,${logoBase64}`

    return new ImageResponse(
      (
        // JSX cho hình ảnh OpenGraph
        <div
          style={{
            fontSize: 32,
            background: 'linear-gradient(to bottom, #041F55, #176faa)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            color: 'white',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <img src={logoSrc} width="400" alt="Kinh Đô Cá Cảnh" />
          </div>
          
          {/* Slogan */}
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            textAlign: 'center',
            margin: '0 0 24px 0',
            padding: 0,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Nơi đam mê hóa thành đại dương
          </h1>
          
          {/* Mô tả */}
          <p style={{ 
            fontSize: '24px', 
            textAlign: 'center',
            margin: 0,
            padding: 0,
            maxWidth: '800px'
          }}>
            Chuyên cung cấp các loại cá cảnh, thủy sinh, phụ kiện và thức ăn cho cá với chất lượng cao và giá cả hợp lý
          </p>
        </div>
      ),
      {
        ...size,
      }
    )
  } catch (error) {
    console.error('Lỗi khi tạo ảnh OpenGraph:', error)
    
    // Trả về một ảnh mặc định nếu có lỗi
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 32,
            background: 'linear-gradient(to bottom, #041F55, #176faa)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            color: 'white',
          }}
        >
          <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>
            Kinh Đô Cá Cảnh
          </h1>
          <p>Nơi đam mê hóa thành đại dương</p>
        </div>
      ),
      {
        ...size,
      }
    )
  }
} 