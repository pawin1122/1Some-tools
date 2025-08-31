class BookmarkManager {
    constructor() {
        this.bookmarks = new Map();
        this.sortMode = false;
        this.draggedElement = null;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.updateDisplay();
        this.updateYAML();
    }

    addLog(message, type = 'info') {
        const logs = document.getElementById('logs');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logs.appendChild(logEntry);
        logs.scrollTop = logs.scrollHeight;
    }

    async fetchPageInfo(url) {
        this.addLog(`开始获取网页信息: ${url}`);
        
        try {
            // 使用CORS代理服务来获取网页内容
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                throw new Error('无法获取网页内容');
            }
            
            const data = await response.json();
            const html = data.contents;
            
            // 解析HTML获取标题
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;
            
            // 获取网站图标
            const favicon = await this.getFavicon(url);
            
            this.addLog(`成功获取信息: ${title}`, 'success');
            return { title, favicon };
        } catch (error) {
            this.addLog(`获取网页信息失败: ${error.message}`, 'error');
            // 返回默认值
            return {
                title: new URL(url).hostname,
                favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`
            };
        }
    }

    async getFavicon(url) {
        const domain = new URL(url).hostname;
        
        // 尝试多个图标源
        const faviconSources = [
            `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
            `https://favicon.ico?domain=${domain}`,
            `https://api.faviconkit.com/${domain}/64`,
            `https://icon.horse/icon/${domain}`
        ];

        for (const source of faviconSources) {
            try {
                const response = await fetch(source, { method: 'HEAD' });
                if (response.ok) {
                    return source;
                }
            } catch (error) {
                continue;
            }
        }
        
        return faviconSources[0]; // 返回默认的Google图标服务
    }

    async addBookmark() {
        const urlInput = document.getElementById('bookmarkUrl');
        const categoryInput = document.getElementById('bookmarkCategory');
        const customTitleInput = document.getElementById('customTitle');
        const batchModeCheckbox = document.getElementById('batchMode');

        const urlText = urlInput.value.trim();
        let category = categoryInput.value.trim();
        const customTitle = customTitleInput.value.trim();
        const batchMode = batchModeCheckbox.checked;

        // 如果没有填写分类，使用默认分类
        if (!category) {
            category = '未整理';
        }

        if (!urlText) {
            this.addLog('请填写链接地址', 'error');
            return;
        }

        // 解析URL列表
        let urls = [];
        if (batchMode && urlText.includes('\n')) {
            urls = urlText.split('\n').map(url => url.trim()).filter(url => url !== '');
        } else {
            urls = [urlText];
        }

        // 验证所有URL格式
        const validUrls = [];
        for (const url of urls) {
            try {
                new URL(url);
                validUrls.push(url);
            } catch (error) {
                this.addLog(`跳过无效URL: ${url}`, 'warning');
            }
        }

        if (validUrls.length === 0) {
            this.addLog('没有有效的URL地址', 'error');
            return;
        }

        // 显示加载状态
        const button = event.target;
        const originalText = button.textContent;
        button.innerHTML = `<span class="loading"></span> 处理中... (${validUrls.length})`;
        button.disabled = true;

        let successCount = 0;
        let errorCount = 0;

        try {
            for (const url of validUrls) {
                try {
                    const pageInfo = await this.fetchPageInfo(url);
                    const title = customTitle || pageInfo.title;
                    
                    const bookmark = {
                        url,
                        title,
                        category,
                        favicon: pageInfo.favicon,
                        abbr: this.generateAbbr(url),
                        id: Date.now() + Math.random(),
                        description: new URL(url).hostname
                    };

                    // 按分类存储书签
                    if (!this.bookmarks.has(category)) {
                        this.bookmarks.set(category, []);
                    }
                    
                    this.bookmarks.get(category).push(bookmark);
                    successCount++;
                    
                    this.addLog(`成功添加: ${title}`, 'success');
                } catch (error) {
                    errorCount++;
                    this.addLog(`添加失败: ${url} - ${error.message}`, 'error');
                }
            }

            this.saveToStorage();
            this.updateDisplay();
            this.updateYAML();

            // 清空输入
            urlInput.value = '';
            if (!batchMode || validUrls.length === 1) {
                customTitleInput.value = '';
            }
            // 保留分类输入，方便连续添加

            this.addLog(`批量处理完成: 成功 ${successCount} 个, 失败 ${errorCount} 个`, 
                       errorCount === 0 ? 'success' : 'warning');
        } catch (error) {
            this.addLog(`批量处理失败: ${error.message}`, 'error');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    }



    updateDisplay() {
        const preview = document.getElementById('bookmarksPreview');
        preview.innerHTML = '';

        if (this.bookmarks.size === 0) {
            preview.innerHTML = '<p style="text-align: center; color: #666;">暂无书签，请添加第一个书签</p>';
            return;
        }

        for (const [category, bookmarks] of this.bookmarks) {
            bookmarks.forEach((bookmark, index) => {
                const card = this.createBookmarkCard(bookmark, category, index);
                preview.appendChild(card);
            });
        }
    }

    // 拖拽排序相关方法
    toggleSortMode() {
        this.sortMode = !this.sortMode;
        const button = document.getElementById('sortToggle');
        
        if (this.sortMode) {
            button.textContent = '保存排序';
            button.className = 'btn-secondary active';
            this.addLog('拖拽排序模式已启用', 'info');
        } else {
            button.textContent = '启用拖拽排序';
            button.className = 'btn-secondary';
            this.saveToStorage();
            this.updateYAML();
            this.addLog('排序已保存', 'success');
        }
        
        this.updateDisplay();
    }

    handleDragStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        const targetCard = e.target.closest('.bookmark-card');
        if (targetCard && targetCard !== this.draggedElement) {
            targetCard.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        const targetCard = e.target.closest('.bookmark-card');
        if (targetCard) {
            targetCard.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        
        const targetCard = e.target.closest('.bookmark-card');
        if (!targetCard || this.draggedElement === targetCard) return;
        
        const draggedCategory = this.draggedElement.dataset.category;
        const draggedIndex = parseInt(this.draggedElement.dataset.index);
        const targetCategory = targetCard.dataset.category;
        const targetIndex = parseInt(targetCard.dataset.index);
        
        if (draggedCategory === targetCategory) {
            // 同一分类内排序
            const bookmarks = this.bookmarks.get(draggedCategory);
            const draggedBookmark = bookmarks[draggedIndex];
            
            // 移除原位置的元素
            bookmarks.splice(draggedIndex, 1);
            
            // 插入到新位置
            bookmarks.splice(targetIndex, 0, draggedBookmark);
            
            this.addLog(`已调整 "${draggedBookmark.title}" 的位置`, 'info');
            this.updateDisplay();
        }
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        document.querySelectorAll('.bookmark-card').forEach(card => {
            card.classList.remove('drag-over');
        });
        this.draggedElement = null;
    }

    // 重新获取图标方法
    async refreshIcon(category, index) {
        const bookmarks = this.bookmarks.get(category);
        if (!bookmarks || !bookmarks[index]) return;

        const bookmark = bookmarks[index];
        const button = event.target;
        const originalText = button.textContent;
        
        button.innerHTML = '<span class="loading"></span>';
        button.disabled = true;

        try {
            const newFavicon = await this.getFavicon(bookmark.url);
            
            if (newFavicon !== bookmark.favicon) {
                bookmark.favicon = newFavicon;
                this.saveToStorage();
                this.updateDisplay();
                this.updateYAML();
                this.addLog(`已更新 "${bookmark.title}" 的图标`, 'success');
            } else {
                this.addLog(`"${bookmark.title}" 的图标无需更新`, 'info');
            }
        } catch (error) {
            this.addLog(`更新图标失败: ${error.message}`, 'error');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    }

    // 删除图标方法
    removeIcon(category, index) {
        const bookmarks = this.bookmarks.get(category);
        if (!bookmarks || !bookmarks[index]) return;

        const bookmark = bookmarks[index];
        
        if (bookmark.favicon) {
            bookmark.favicon = null;
            this.saveToStorage();
            this.updateDisplay();
            this.updateYAML();
            this.addLog(`已删除 "${bookmark.title}" 的图标`, 'info');
        } else {
            this.addLog(`"${bookmark.title}" 没有图标可删除`, 'info');
        }
    }

    // 编辑书签标题
    editTitle(category, index) {
        const bookmarks = this.bookmarks.get(category);
        if (!bookmarks || !bookmarks[index]) return;

        const bookmark = bookmarks[index];
        const newTitle = prompt('请输入新的书签标题：', bookmark.title);
        
        if (newTitle && newTitle.trim() !== '' && newTitle !== bookmark.title) {
            bookmark.title = newTitle.trim();
            // 更新缩写
            bookmark.abbr = this.generateAbbr(bookmark.url);
            this.saveToStorage();
            this.updateDisplay();
            this.updateYAML();
            this.addLog(`已更新 "${bookmark.title}" 的标题`, 'success');
        }
    }

    // 编辑书签描述
    editDescription(category, index) {
        const bookmarks = this.bookmarks.get(category);
        if (!bookmarks || !bookmarks[index]) return;

        const bookmark = bookmarks[index];
        const currentDesc = bookmark.description || new URL(bookmark.url).hostname;
        const newDescription = prompt('请输入新的书签描述：', currentDesc);
        
        if (newDescription && newDescription.trim() !== '' && newDescription !== currentDesc) {
            bookmark.description = newDescription.trim();
            this.saveToStorage();
            this.updateDisplay();
            this.updateYAML();
            this.addLog(`已更新 "${bookmark.title}" 的描述`, 'success');
        }
    }

    // 编辑书签缩写
    editAbbr(category, index) {
        const bookmarks = this.bookmarks.get(category);
        if (!bookmarks || !bookmarks[index]) return;

        const bookmark = bookmarks[index];
        const currentAbbr = bookmark.abbr || this.generateAbbr(bookmark.url);
        const newAbbr = prompt('请输入新的书签缩写（最多2个大写英文字母）：', currentAbbr);
        
        if (newAbbr && newAbbr.trim() !== '' && newAbbr !== currentAbbr) {
            // 验证输入：只允许大写英文字母，最多2个字符
            const validAbbr = newAbbr.trim().toUpperCase().replace(/[^A-Z]/g, '').substring(0, 2);
            if (validAbbr) {
                bookmark.abbr = validAbbr;
                this.saveToStorage();
                this.updateDisplay();
                this.updateYAML();
                this.addLog(`已更新 "${bookmark.title}" 的缩写为 "${validAbbr}"`, 'success');
            } else {
                this.addLog(`缩写无效，请输入英文字母`, 'error');
            }
        }
    }

    // 生成缩写 - 使用域名前两个大写英文字母
    generateAbbr(url) {
        try {
            const hostname = new URL(url).hostname;
            // 提取域名部分（去除www.和顶级域名）
            const domain = hostname.replace(/^www\./, '').split('.')[0];
            // 取前两个大写英文字母
            const letters = domain.replace(/[^a-zA-Z]/g, '').toUpperCase();
            return letters.substring(0, 2);
        } catch (error) {
            return 'XX'; // 默认值
        }
    }

    createBookmarkCard(bookmark, category, index) {
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        card.draggable = this.sortMode;
        card.dataset.category = category;
        card.dataset.index = index;
        card.dataset.id = bookmark.id;
        
        if (this.sortMode) {
            card.style.cursor = 'move';
            card.style.border = '2px dashed #667eea';
        }

        card.innerHTML = `
            <div class="bookmark-header">
                <img class="bookmark-icon" src="${bookmark.favicon}" alt="${bookmark.title}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNMTYgOEMxNiA4IDE2IDggMTYgOEMxNiA4IDIwIDEwIDIwIDE2QzIwIDIyIDE2IDI0IDE2IDI0QzE2IDI0IDEyIDIyIDEyIDE2QzEyIDEwIDE2IDggMTYgOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg=='">
                <div class="bookmark-title">${bookmark.title}</div>
            </div>
            <div class="bookmark-url">${bookmark.url}</div>
            <div class="bookmark-category">${bookmark.category}</div>
            <div class="bookmark-description">${bookmark.description || new URL(bookmark.url).hostname}</div>
            <div class="bookmark-actions">
                <button class="btn-small btn-primary" onclick="bookmarkManager.refreshIcon('${category}', ${index})">🔄 更新</button>
                ${bookmark.favicon ? `<button class="btn-small btn-secondary" onclick="bookmarkManager.removeIcon('${category}', ${index})">🗑️ 删图标</button>` : ''}
                <button class="btn-small btn-info" onclick="bookmarkManager.editTitle('${category}', ${index})">✏️ 改标题</button>
                <button class="btn-small btn-info" onclick="bookmarkManager.editDescription('${category}', ${index})">📝 改描述</button>
                <button class="btn-small btn-warning" onclick="bookmarkManager.editAbbr('${category}', ${index})">🔤 改缩写</button>
                <button class="btn-small btn-danger" onclick="bookmarkManager.removeBookmark('${category}', ${index})">🗑️ 删除</button>
            </div>
        `;

        // 添加拖拽事件监听器
        if (this.sortMode) {
            card.addEventListener('dragstart', this.handleDragStart.bind(this));
            card.addEventListener('dragover', this.handleDragOver.bind(this));
            card.addEventListener('dragleave', this.handleDragLeave.bind(this));
            card.addEventListener('drop', this.handleDrop.bind(this));
            card.addEventListener('dragend', this.handleDragEnd.bind(this));
        }

        return card;
    }

    removeBookmark(category, id) {
        if (this.bookmarks.has(category)) {
            const bookmarks = this.bookmarks.get(category);
            const index = bookmarks.findIndex(b => b.id === id);
            if (index !== -1) {
                const removed = bookmarks.splice(index, 1)[0];
                if (bookmarks.length === 0) {
                    this.bookmarks.delete(category);
                }
                this.saveToStorage();
                this.updateDisplay();
                this.updateYAML();
                this.addLog(`删除书签: ${removed.title}`, 'info');
            }
        }
    }

    updateYAML() {
        const yamlOutput = document.getElementById('yamlOutput');
        
        if (this.bookmarks.size === 0) {
            yamlOutput.value = '# 暂无书签配置\n# 请添加书签以生成YAML配置';
            return;
        }

        let yaml = '';
        
        for (const [category, bookmarks] of this.bookmarks) {
            yaml += `- ${category}:\n`;
            bookmarks.forEach(bookmark => {
                yaml += `    - ${bookmark.title}:\n`;
                yaml += `        - abbr: ${bookmark.abbr}\n`;
                yaml += `          href: ${bookmark.url}\n`;
                if (bookmark.favicon && bookmark.favicon.trim() !== '') {
                    yaml += `          icon: ${bookmark.favicon}\n`;
                }
                const description = bookmark.description || new URL(bookmark.url).hostname;
                yaml += `          description: ${description}\n`;
            });
        }

        yamlOutput.value = yaml;
    }

    generateYAML() {
        this.updateYAML();
        this.addLog('YAML配置已更新', 'info');
    }

    async copyYAML() {
        const yamlOutput = document.getElementById('yamlOutput');
        
        try {
            await navigator.clipboard.writeText(yamlOutput.value);
            this.addLog('YAML配置已复制到剪贴板', 'success');
            
            // 显示复制成功提示
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = '已复制!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } catch (error) {
            this.addLog('复制失败，请手动选择复制', 'error');
        }
    }

    downloadYAML() {
        const yamlOutput = document.getElementById('yamlOutput');
        const content = yamlOutput.value;
        
        if (!content || content === '# 暂无书签配置\n# 请添加书签以生成YAML配置') {
            this.addLog('没有可下载的内容', 'warning');
            return;
        }

        const blob = new Blob([content], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'homepage-bookmarks.yaml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addLog('YAML配置文件已下载', 'success');
    }

    clearAll() {
        if (confirm('确定要清空所有书签吗？此操作不可恢复。')) {
            this.bookmarks.clear();
            this.saveToStorage();
            this.updateDisplay();
            this.updateYAML();
            this.addLog('已清空所有书签', 'info');
        }
    }

    saveToStorage() {
        try {
            const data = Array.from(this.bookmarks.entries());
            localStorage.setItem('homepageBookmarks', JSON.stringify(data));
        } catch (error) {
            this.addLog('保存到本地存储失败', 'error');
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('homepageBookmarks');
            if (saved) {
                const data = JSON.parse(saved);
                this.bookmarks = new Map(data);
                this.addLog(`从本地存储加载了 ${this.getTotalBookmarks()} 个书签`, 'info');
            }
        } catch (error) {
            this.addLog('从本地存储加载失败', 'error');
        }
    }

    getTotalBookmarks() {
        let total = 0;
        for (const bookmarks of this.bookmarks.values()) {
            total += bookmarks.length;
        }
        return total;
    }
}

// 初始化应用
const bookmarkManager = new BookmarkManager();

// 全局函数供HTML调用
function addBookmark() {
    bookmarkManager.addBookmark();
}

function generateYAML() {
    bookmarkManager.generateYAML();
}

function copyYAML() {
    bookmarkManager.copyYAML();
}

function downloadYAML() {
    bookmarkManager.downloadYAML();
}

function clearAll() {
    bookmarkManager.clearAll();
}

// 回车键支持 - 优化用户体验
document.addEventListener('keydown', function(e) {
    // 分类和标题输入框始终支持回车
    if (e.key === 'Enter' && !e.shiftKey && 
        (e.target.id === 'bookmarkCategory' || e.target.id === 'customTitle')) {
        e.preventDefault();
        addBookmark();
    }
    
    // 链接地址栏的智能回车处理
    if (e.key === 'Enter' && e.target.id === 'bookmarkUrl') {
        const batchModeCheckbox = document.getElementById('batchMode');
        
        if (e.shiftKey) {
            // Shift+Enter 始终允许换行
            return; // 允许默认行为（换行）
        }
        
        if (!batchModeCheckbox.checked) {
            // 批量模式关闭时：单行模式，Enter直接提交
            e.preventDefault();
            addBookmark();
        } else {
            // 批量模式开启时：Enter换行，不提交
            // 允许默认行为（换行）
        }
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    bookmarkManager.addLog('书签生成器已加载完成', 'info');
});