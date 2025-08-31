#!/usr/bin/env python3
"""
个人工具集启动器
一键启动所有工具，并提供简单的管理功能
"""

import subprocess
import os
import webbrowser
import time
import signal
import sys
from pathlib import Path

class ToolManager:
    def __init__(self):
        self.tools = {
            'color_generator': {'port': 8080, 'path': 'tools/color_generator', 'name': '🎨 颜色生成器'},
            'addlinks': {'port': 8000, 'path': 'tools/links_homepage/addlinks', 'name': '📥 书签添加器'},
            'editlinks': {'port': 8001, 'path': 'tools/links_homepage/editlinks', 'name': '✏️ 书签编辑器'}
        }
        self.processes = {}
        
    def check_port(self, port):
        """检查端口是否被占用"""
        try:
            result = subprocess.run(['lsof', '-i', f':{port}'], 
                                  capture_output=True, text=True)
            return result.returncode == 0
        except:
            return False
    
    def find_free_port(self, start_port):
        """查找可用端口"""
        port = start_port
        while self.check_port(port):
            port += 1
        return port
    
    def start_tool(self, tool_name, tool_info):
        """启动单个工具"""
        port = self.find_free_port(tool_info['port'])
        path = tool_info['path']
        
        if port != tool_info['port']:
            print(f"⚠️  端口 {tool_info['port']} 被占用，使用端口 {port}")
        
        try:
            # 切换到工具目录
            original_dir = os.getcwd()
            os.chdir(path)
            
            # 启动服务器
            process = subprocess.Popen(
                ['python3', '-m', 'http.server', str(port)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            
            # 返回原目录
            os.chdir(original_dir)
            
            self.processes[tool_name] = {
                'process': process,
                'port': port,
                'name': tool_info['name']
            }
            
            print(f"✅ {tool_info['name']} 已启动: http://localhost:{port}")
            return True
            
        except Exception as e:
            print(f"❌ 启动 {tool_info['name']} 失败: {e}")
            return False
    
    def start_all(self):
        """启动所有工具"""
        print("🚀 启动个人工具集...")
        print("=" * 50)
        
        for tool_name, tool_info in self.tools.items():
            self.start_tool(tool_name, tool_info)
            time.sleep(0.5)  # 避免同时启动造成冲突
        
        print("=" * 50)
        print("🎯 所有工具已启动完成！")
        print("\n📱 访问地址:")
        for tool_name, info in self.processes.items():
            print(f"   {info['name']}: http://localhost:{info['port']}")
        
        print(f"\n💡 提示: 按 Ctrl+C 停止所有服务")
        
        # 等待用户输入
        try:
            input("\n按 Enter 键在浏览器中打开所有工具，或 Ctrl+C 退出...")
            self.open_all_in_browser()
            
            # 保持程序运行
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stop_all()
    
    def open_all_in_browser(self):
        """在浏览器中打开所有工具"""
        for info in self.processes.values():
            webbrowser.open_new_tab(f"http://localhost:{info['port']}")
        print("🌐 已在浏览器中打开所有工具")
    
    def stop_all(self):
        """停止所有工具"""
        print("\n🛑 正在停止所有工具...")
        for tool_name, info in self.processes.items():
            try:
                info['process'].terminate()
                info['process'].wait(timeout=5)
                print(f"✅ 已停止 {info['name']}")
            except subprocess.TimeoutExpired:
                info['process'].kill()
                print(f"⚠️  强制停止 {info['name']}")
            except:
                pass
        
        print("👋 所有工具已停止")
        sys.exit(0)
    
    def list_tools(self):
        """列出所有可用工具"""
        print("📋 可用工具列表:")
        for tool_name, info in self.tools.items():
            print(f"   {info['name']} - 端口: {info['port']}")
    
    def start_specific(self, tool_name):
        """启动特定工具"""
        if tool_name not in self.tools:
            print(f"❌ 工具 '{tool_name}' 不存在")
            self.list_tools()
            return
        
        tool_info = self.tools[tool_name]
        if self.start_tool(tool_name, tool_info):
            port = self.processes[tool_name]['port']
            webbrowser.open_new_tab(f"http://localhost:{port}")
            print(f"🌐 已在浏览器中打开 {tool_info['name']}")
            
            # 等待用户中断
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                self.stop_tool(tool_name)
    
    def stop_tool(self, tool_name):
        """停止特定工具"""
        if tool_name in self.processes:
            try:
                self.processes[tool_name]['process'].terminate()
                print(f"✅ 已停止 {self.processes[tool_name]['name']}")
                del self.processes[tool_name]
            except:
                pass

def main():
    manager = ToolManager()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "list":
            manager.list_tools()
        elif command in manager.tools:
            manager.start_specific(command)
        else:
            print("❌ 未知命令")
            print("\n用法:")
            print("  python3 start_tools.py           # 启动所有工具")
            print("  python3 start_tools.py list      # 列出所有工具")
            print("  python3 start_tools.py color_generator  # 启动颜色生成器")
            print("  python3 start_tools.py addlinks   # 启动书签添加器")
            print("  python3 start_tools.py editlinks  # 启动书签编辑器")
    else:
        manager.start_all()

if __name__ == "__main__":
    main()