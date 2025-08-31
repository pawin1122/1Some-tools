#!/usr/bin/env python3
"""
简洁工具启动器
启动本地服务器，提供三个工具的访问入口
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    # 切换到脚本所在目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # 检查端口是否可用
    def check_port(port):
        import socket
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(('localhost', port)) != 0
    
    if not check_port(PORT):
        print(f"端口 {PORT} 已被占用，尝试端口 {PORT + 1}")
        PORT += 1
    
    print(f"🚀 启动工具箱服务器...")
    print(f"📁 根目录: {os.getcwd()}")
    print(f"🔗 访问地址: http://localhost:{PORT}/")
    print(f"🎨 颜色生成器: http://localhost:{PORT}/tools/color_generator/index.html")
    print(f"📥 书签添加器: http://localhost:{PORT}/tools/links_homepage/addlinks/index.html")
    print(f"✏️ 书签编辑器: http://localhost:{PORT}/tools/links_homepage/editlinks/index.html")
    print("\n按 Ctrl+C 停止服务器")
    
    # 自动打开浏览器
    try:
        webbrowser.open(f'http://localhost:{PORT}/', new=2)
    except:
        pass
    
    # 启动服务器
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 服务器已停止")
            httpd.shutdown()