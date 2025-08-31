// YAML解析器
class YAMLParser {
    constructor() {
        this.originalData = null;
        this.currentData = null;
    }

    parseYAML() {
        const yamlText = document.getElementById('yamlInput').value.trim();
        if (!yamlText) {
            alert('请输入YAML配置！');
            return;
        }

        try {
            // 使用js-yaml库解析YAML
            const parsed = jsyaml.load(yamlText);
            
            if (!Array.isArray(parsed)) {
                throw new Error('YAML格式不正确：根元素应该是数组');
            }

            this.originalData = JSON.parse(JSON.stringify(parsed));
            this.currentData = parsed;
            
            bookmarkEditor.renderBookmarks(this.currentData);
            document.getElementById('previewSection').style.display = 'block';
            
            // 实时同步更新YAML输出
            this.updateYAMLDisplay();
            
            console.log('YAML解析成功:', parsed);
        } catch (error) {
            console.error('YAML解析错误:', error);
            alert(`YAML解析错误: ${error.message}`);
        }
    }

    updateYAMLDisplay() {
        if (!this.currentData || this.currentData.length === 0) {
            document.getElementById('yamlOutput').textContent = '# 暂无数据';
            return;
        }
        
        const yamlString = this.yamlToString(this.currentData);
        document.getElementById('yamlOutput').textContent = yamlString;
    }

    loadSampleData() {
        const sampleYAML = `- Developer:
    - GitHub:
        - abbr: GH
          href: https://github.com
          description: 全球最大的代码托管平台
    - Stack Overflow:
        - abbr: SO
          href: https://stackoverflow.com
          description: 程序员必备的问答社区
    - VS Code:
        - abbr: VS
          href: https://code.visualstudio.com
          description: 微软开发的轻量级代码编辑器

- Entertainment:
    - YouTube:
        - abbr: YT
          href: https://youtube.com
          description: 全球最大的视频分享平台
    - Netflix:
        - abbr: NF
          href: https://netflix.com
          description: 流媒体视频服务平台

- Productivity:
    - Google Drive:
        - abbr: GD
          href: https://drive.google.com
          description: 云端存储和协作平台
    - Notion:
        - abbr: NT
          href: https://notion.so
          description: 全能的笔记和知识管理工具`;

        document.getElementById('yamlInput').value = sampleYAML;
    }

    yamlToString(data) {
        return jsyaml.dump(data, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
            sortKeys: false
        });
    }

    exportYAML() {
        if (!this.currentData) return;
        
        const yamlString = this.yamlToString(this.currentData);
        document.getElementById('yamlOutput').textContent = yamlString;
        document.getElementById('outputSection').style.display = 'block';
        
        // 滚动到输出区域
        document.getElementById('outputSection').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    exportYAMLWithoutScroll() {
        if (!this.currentData) return;
        
        const yamlString = this.yamlToString(this.currentData);
        document.getElementById('yamlOutput').textContent = yamlString;
        document.getElementById('outputSection').style.display = 'block';
        
        // 不滚动到输出区域，保持当前位置
    }

    copyToClipboard() {
        const yamlOutput = document.getElementById('yamlOutput').textContent;
        if (!yamlOutput) {
            alert('没有可复制的YAML内容！');
            return;
        }

        navigator.clipboard.writeText(yamlOutput).then(() => {
            alert('YAML已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败:', err);
            // 备用复制方法
            const textArea = document.createElement('textarea');
            textArea.value = yamlOutput;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('YAML已复制到剪贴板！');
        });
    }
}

// 书签编辑器
class BookmarkEditor {
    constructor() {
        this.categories = [];
        this.sortMode = false;
        this.draggedElement = null;
    }

    renderBookmarks(data) {
        this.categories = data;
        const container = document.getElementById('categoriesContainer');
        container.innerHTML = '';

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h4>没有书签数据</h4>
                    <p>请粘贴有效的YAML配置</p>
                </div>
            `;
            return;
        }

        data.forEach((category, categoryIndex) => {
            const categoryName = Object.keys(category)[0];
            const bookmarks = category[categoryName];
            
            const categoryDiv = this.createCategoryDiv(categoryName, bookmarks, categoryIndex);
            container.appendChild(categoryDiv);
        });

        this.addSortListeners();
    }

    createCategoryDiv(categoryName, bookmarks, categoryIndex) {
        const div = document.createElement('div');
        div.className = 'category';
        div.dataset.categoryIndex = categoryIndex;

        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <h3 class="category-title">📁 ${categoryName}</h3>
            <div>
                <button onclick="bookmarkEditor.addBookmark(${categoryIndex})" class="btn-primary btn-small">➕ 添加书签</button>
                <button onclick="bookmarkEditor.toggleSortMode(${categoryIndex})" class="btn-secondary btn-small" id="sortToggle-${categoryIndex}">🔀 排序</button>
            </div>
        `;

        const grid = document.createElement('div');
        grid.className = 'bookmarks-grid';
        grid.id = `bookmarks-${categoryIndex}`;

        bookmarks.forEach((bookmark, bookmarkIndex) => {
            const bookmarkName = Object.keys(bookmark)[0];
            const details = bookmark[bookmarkName][0];
            const card = this.createBookmarkCard(bookmarkName, details, categoryIndex, bookmarkIndex);
            grid.appendChild(card);
        });

        div.appendChild(header);
        div.appendChild(grid);
        return div;
    }

    createBookmarkCard(name, details, categoryIndex, bookmarkIndex) {
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        card.draggable = this.sortMode;
        card.dataset.categoryIndex = categoryIndex;
        card.dataset.bookmarkIndex = bookmarkIndex;

        const abbr = details.abbr || this.generateAbbr(details.href);
        const iconUrl = details.icon || `https://www.google.com/s2/favicons?domain=${details.href}&sz=32`;

        card.innerHTML = `
            <div class="bookmark-header">
                ${details.icon ? 
                    `<img class="bookmark-icon" src="${iconUrl}" alt="${name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` :
                    ''
                }
                <div class="bookmark-abbr" ${details.icon ? 'style="display: none;"' : ''}>${abbr}</div>
                <div class="bookmark-title">${name}</div>
            </div>
            <div class="bookmark-url">${details.href}</div>
            <div class="bookmark-description">${details.description || ''}</div>
            <div class="bookmark-actions">
                <button onclick="bookmarkEditor.editBookmark(${categoryIndex}, ${bookmarkIndex})" class="btn-warning btn-small">✏️ 编辑</button>
                <button onclick="bookmarkEditor.deleteBookmark(${categoryIndex}, ${bookmarkIndex})" class="btn-danger btn-small">🗑️ 删除</button>
                <span class="sort-handle" style="display: none;">⋮⋮</span>
            </div>
        `;

        return card;
    }

    generateAbbr(url) {
        try {
            const domain = new URL(url).hostname.replace('www.', '');
            const parts = domain.split('.')[0].toUpperCase().match(/[A-Z]/g) || [];
            return parts.slice(0, 2).join('') || domain.substring(0, 2).toUpperCase();
        } catch (error) {
            return 'XX';
        }
    }

    addBookmark(categoryIndex) {
        const modal = new Modal();
        modal.show({
            title: '添加新书签',
            onSave: (formData) => {
                const newBookmark = {
                    [formData.name]: [{
                        abbr: formData.abbr || this.generateAbbr(formData.url),
                        href: formData.url,
                        description: formData.description || '',
                        icon: formData.icon || ''
                    }]
                };

                // 保存当前滚动位置
                const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                
                this.categories[categoryIndex][Object.keys(this.categories[categoryIndex])[0]].push(newBookmark);
                this.renderBookmarks(this.categories);
                yamlParser.updateYAMLDisplay();
                
                // 恢复滚动位置
                window.scrollTo(0, scrollPosition);
            }
        });
    }

    editBookmark(categoryIndex, bookmarkIndex) {
        const categoryName = Object.keys(this.categories[categoryIndex])[0];
        const bookmarkName = Object.keys(this.categories[categoryIndex][categoryName][bookmarkIndex])[0];
        const details = this.categories[categoryIndex][categoryName][bookmarkIndex][bookmarkName][0];

        const modal = new Modal();
        modal.show({
            title: '编辑书签',
            data: {
                name: bookmarkName,
                abbr: details.abbr || '',
                url: details.href,
                description: details.description || '',
                icon: details.icon || ''
            },
            onSave: (formData) => {
                // 保存当前滚动位置
                const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                
                // 删除旧书签
                this.categories[categoryIndex][categoryName].splice(bookmarkIndex, 1);
                
                // 添加更新后的书签
                const updatedBookmark = {
                    [formData.name]: [{
                        abbr: formData.abbr || this.generateAbbr(formData.url),
                        href: formData.url,
                        description: formData.description || '',
                        icon: formData.icon || ''
                    }]
                };

                // 插入到原来的位置
                this.categories[categoryIndex][categoryName].splice(bookmarkIndex, 0, updatedBookmark);
                this.renderBookmarks(this.categories);
                yamlParser.updateYAMLDisplay();
                
                // 恢复滚动位置
                window.scrollTo(0, scrollPosition);
            }
        });
    }

    deleteBookmark(categoryIndex, bookmarkIndex) {
        if (confirm('确定要删除这个书签吗？')) {
            // 保存当前滚动位置
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            const categoryName = Object.keys(this.categories[categoryIndex])[0];
            this.categories[categoryIndex][categoryName].splice(bookmarkIndex, 1);
            this.renderBookmarks(this.categories);
            yamlParser.updateYAMLDisplay();
            
            // 恢复滚动位置
            window.scrollTo(0, scrollPosition);
        }
    }

    toggleSortMode(categoryIndex) {
        const category = document.querySelector(`[data-category-index="${categoryIndex}"]`);
        const toggle = document.getElementById(`sortToggle-${categoryIndex}`);
        
        this.sortMode = !category.classList.contains('sort-mode');
        
        if (this.sortMode) {
            category.classList.add('sort-mode');
            toggle.textContent = '✅ 完成排序';
            toggle.className = 'btn-success btn-small';
            
            // 显示排序手柄
            category.querySelectorAll('.sort-handle').forEach(handle => {
                handle.style.display = 'inline';
            });
            
            // 启用拖拽
            category.querySelectorAll('.bookmark-card').forEach(card => {
                card.draggable = true;
            });
        } else {
            category.classList.remove('sort-mode');
            toggle.textContent = '🔀 排序';
            toggle.className = 'btn-secondary btn-small';
            
            // 隐藏排序手柄
            category.querySelectorAll('.sort-handle').forEach(handle => {
                handle.style.display = 'none';
            });
            
            // 禁用拖拽
            category.querySelectorAll('.bookmark-card').forEach(card => {
                card.draggable = false;
            });
        }
    }

    addSortListeners() {
        // 为书签卡片添加拖拽事件
        document.querySelectorAll('.bookmark-card').forEach(card => {
            card.addEventListener('dragstart', (e) => {
                if (!this.sortMode) return;
                this.draggedElement = e.target;
                e.target.classList.add('dragging');
                
                // 存储拖拽数据
                e.dataTransfer.effectAllowed = 'move';
                const dragData = {
                    categoryIndex: parseInt(e.target.dataset.categoryIndex),
                    bookmarkIndex: parseInt(e.target.dataset.bookmarkIndex)
                };
                e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
            });

            card.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
                this.draggedElement = null;
            });

            card.addEventListener('dragover', (e) => {
                if (!this.sortMode || !this.draggedElement) return;
                e.preventDefault();
                e.currentTarget.classList.add('drop-zone');
            });

            card.addEventListener('dragleave', (e) => {
                e.currentTarget.classList.remove('drop-zone');
            });

            card.addEventListener('drop', (e) => {
                if (!this.sortMode || !this.draggedElement) return;
                e.preventDefault();
                e.currentTarget.classList.remove('drop-zone');

                const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
                const targetCard = e.currentTarget;

                if (draggedData.categoryIndex === parseInt(targetCard.dataset.categoryIndex) && 
                    draggedData.bookmarkIndex === parseInt(targetCard.dataset.bookmarkIndex)) {
                    return; // 同一个书签
                }

                const draggedCategoryIndex = draggedData.categoryIndex;
                const targetCategoryIndex = parseInt(targetCard.dataset.categoryIndex);
                const draggedIndex = draggedData.bookmarkIndex;
                const targetIndex = parseInt(targetCard.dataset.bookmarkIndex);

                try {
                    // 获取要移动的书签数据
                    const draggedCategoryName = Object.keys(this.categories[draggedCategoryIndex])[0];
                    const draggedBookmarkData = this.categories[draggedCategoryIndex][draggedCategoryName][draggedIndex];
                    
                    // 确保数据结构正确 - 书签应该是一个对象，键是书签名称
                    if (!draggedBookmarkData || typeof draggedBookmarkData !== 'object') {
                        console.error('无效的书签数据结构:', draggedBookmarkData);
                        return;
                    }

                    // 保存当前滚动位置
                    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // 从原类别中移除
                    this.categories[draggedCategoryIndex][draggedCategoryName].splice(draggedIndex, 1);
                    
                    // 添加到新类别
                    const targetCategoryName = Object.keys(this.categories[targetCategoryIndex])[0];
                    
                    if (draggedCategoryIndex === targetCategoryIndex) {
                        // 同一类别内重新排序
                        const newTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
                        this.categories[targetCategoryIndex][targetCategoryName].splice(newTargetIndex, 0, draggedBookmarkData);
                    } else {
                        // 跨类别移动
                        this.categories[targetCategoryIndex][targetCategoryName].splice(targetIndex, 0, draggedBookmarkData);
                    }

                    // 更新yamlParser.currentData以保持数据同步
                    yamlParser.currentData = this.categories;
                    
                    // 重新渲染并更新YAML显示
                    this.renderBookmarks(this.categories);
                    yamlParser.updateYAMLDisplay();
                    
                    // 恢复滚动位置
                    window.scrollTo(0, scrollPosition);
                    
                } catch (error) {
                    console.error('拖拽操作出错:', error);
                    alert('拖拽操作失败，请重试');
                }
            });
        });

        // 为类别容器添加拖拽事件，支持拖拽到类别末尾
        document.querySelectorAll('.category').forEach(category => {
            category.addEventListener('dragover', (e) => {
                if (!this.sortMode || !this.draggedElement) return;
                
                // 检查是否是拖拽到类别末尾
                const rect = category.getBoundingClientRect();
                const isNearBottom = e.clientY > rect.bottom - 50;
                
                if (isNearBottom) {
                    e.preventDefault();
                    category.classList.add('drop-zone');
                }
            });

            category.addEventListener('dragleave', (e) => {
                category.classList.remove('drop-zone');
            });

            category.addEventListener('drop', (e) => {
                if (!this.sortMode || !this.draggedElement) return;
                
                const rect = category.getBoundingClientRect();
                const isNearBottom = e.clientY > rect.bottom - 50;
                
                if (!isNearBottom) return;
                
                e.preventDefault();
                category.classList.remove('drop-zone');

                try {
                    const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
                    const targetCategoryIndex = parseInt(category.dataset.categoryIndex);
                    const draggedCategoryIndex = draggedData.categoryIndex;

                    if (draggedCategoryIndex === targetCategoryIndex) return; // 同一类别无需操作

                    // 获取要移动的书签数据
                    const draggedCategoryName = Object.keys(this.categories[draggedCategoryIndex])[0];
                    const draggedBookmarkData = this.categories[draggedCategoryIndex][draggedCategoryName][draggedData.bookmarkIndex];
                    
                    // 确保数据结构正确
                    if (!draggedBookmarkData || typeof draggedBookmarkData !== 'object') {
                        console.error('无效的书签数据结构:', draggedBookmarkData);
                        return;
                    }

                    // 保存当前滚动位置
                    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // 从原类别中移除
                    this.categories[draggedCategoryIndex][draggedCategoryName].splice(draggedData.bookmarkIndex, 1);
                    
                    // 添加到新类别的末尾
                    const targetCategoryName = Object.keys(this.categories[targetCategoryIndex])[0];
                    this.categories[targetCategoryIndex][targetCategoryName].push(draggedBookmarkData);

                    // 更新yamlParser.currentData以保持数据同步
                    yamlParser.currentData = this.categories;
                    
                    // 重新渲染并更新YAML显示
                    this.renderBookmarks(this.categories);
                    yamlParser.updateYAMLDisplay();
                    
                    // 恢复滚动位置
                    window.scrollTo(0, scrollPosition);
                    
                } catch (error) {
                    console.error('拖拽到类别末尾出错:', error);
                    alert('拖拽操作失败，请重试');
                }
            });
        });
    }

    exportToFile() {
        if (!this.categories || this.categories.length === 0) {
            alert('没有可导出的数据！');
            return;
        }

        const yamlString = yamlParser.yamlToString(this.categories);
        const blob = new Blob([yamlString], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookmarks.yaml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    resetChanges() {
        if (confirm('确定要重置所有更改吗？这将恢复到原始YAML数据。')) {
            this.renderBookmarks(yamlParser.originalData);
            yamlParser.currentData = JSON.parse(JSON.stringify(yamlParser.originalData));
            this.categories = yamlParser.currentData;
            yamlParser.exportYAML();
        }
    }

    deduplicateBookmarks() {
        if (!this.categories || this.categories.length === 0) {
            alert('没有可排重的数据！');
            return;
        }

        let totalRemoved = 0;
        let hasDuplicates = false;
        const duplicateInfo = [];

        // 对每个类别进行排重
        this.categories.forEach((category, categoryIndex) => {
            const categoryName = Object.keys(category)[0];
            const bookmarks = category[categoryName];
            const seenUrls = new Map(); // 用于检测重复的URL
            const uniqueBookmarks = [];
            let removedInCategory = 0;

            bookmarks.forEach((bookmark, index) => {
                const bookmarkName = Object.keys(bookmark)[0];
                const details = bookmark[bookmarkName][0];
                const url = details.href;

                if (seenUrls.has(url)) {
                    // 发现重复，记录信息
                    removedInCategory++;
                    duplicateInfo.push({
                        category: categoryName,
                        name: bookmarkName,
                        url: url,
                        keptIndex: seenUrls.get(url),
                        removedIndex: index
                    });
                } else {
                    // 首次出现的URL，保留
                    seenUrls.set(url, index);
                    uniqueBookmarks.push(bookmark);
                }
            });

            if (removedInCategory > 0) {
                hasDuplicates = true;
                totalRemoved += removedInCategory;
                this.categories[categoryIndex][categoryName] = uniqueBookmarks;
            }
        });

        if (!hasDuplicates) {
            alert('没有发现重复的书签！');
            return;
        }

        // 显示排重结果
        const confirmMessage = `发现 ${totalRemoved} 个重复书签：\n\n` +
            duplicateInfo.map(info => 
                `${info.category}: "${info.name}" (${info.url})`
            ).join('\n') + 
            '\n\n是否删除这些重复项？';

        if (confirm(confirmMessage)) {
            // 保存当前滚动位置
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            // 重新渲染并更新YAML
            this.renderBookmarks(this.categories);
            yamlParser.updateYAMLDisplay();
            
            // 恢复滚动位置
            window.scrollTo(0, scrollPosition);
            
            alert(`已删除 ${totalRemoved} 个重复书签！`);
        } else {
            // 用户取消，恢复原始数据
            this.categories = JSON.parse(JSON.stringify(yamlParser.currentData));
        }
    }
}

// 模态框管理器
class Modal {
    constructor() {
        this.modal = document.getElementById('editModal');
        this.form = document.getElementById('editForm');
        this.callback = null;
    }

    show(options) {
        this.callback = options.onSave;
        
        document.getElementById('editName').value = options.data?.name || '';
        document.getElementById('editAbbr').value = options.data?.abbr || '';
        document.getElementById('editUrl').value = options.data?.url || '';
        document.getElementById('editDescription').value = options.data?.description || '';
        document.getElementById('editIcon').value = options.data?.icon || '';
        
        this.updateIconPreview();
        
        this.modal.style.display = 'block';
        document.getElementById('editName').focus();
        
        // 确保模态框在小屏幕上正确显示
        this.adjustModalPosition();
    }

    adjustModalPosition() {
        const modalContent = this.modal.querySelector('.modal-content');
        if (window.innerHeight <= 500) {
            modalContent.style.margin = '5px auto';
        } else if (window.innerHeight <= 700) {
            modalContent.style.margin = '10px auto';
        }
    }

    close() {
        this.modal.style.display = 'none';
        this.form.reset();
    }

    updateIconPreview() {
        const iconUrl = document.getElementById('editIcon').value;
        const preview = document.getElementById('iconPreview');
        
        if (iconUrl) {
            preview.src = iconUrl;
            preview.style.display = 'inline-block';
            preview.onerror = () => {
                preview.style.display = 'none';
            };
        } else {
            preview.style.display = 'none';
        }
    }
}

// 全局实例
const yamlParser = new YAMLParser();
const bookmarkEditor = new BookmarkEditor();
const modal = new Modal();

// 事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 模态框事件
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('editName').value.trim(),
            abbr: document.getElementById('editAbbr').value.trim(),
            url: document.getElementById('editUrl').value.trim(),
            description: document.getElementById('editDescription').value.trim(),
            icon: document.getElementById('editIcon').value.trim()
        };

        if (!formData.name || !formData.url) {
            alert('名称和URL不能为空！');
            return;
        }

        modal.callback(formData);
        modal.close();
    });

    // 图标预览更新
    document.getElementById('editIcon').addEventListener('input', function() {
        modal.updateIconPreview();
    });

    // 自动生成缩写
    document.getElementById('editUrl').addEventListener('blur', function() {
        const abbrInput = document.getElementById('editAbbr');
        if (!abbrInput.value.trim()) {
            abbrInput.value = bookmarkEditor.generateAbbr(this.value);
        }
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === modal.modal) {
            modal.close();
        }
    });

    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.modal.style.display === 'block') {
            modal.close();
        }
    });

    // 窗口大小改变时调整模态框位置
    window.addEventListener('resize', function() {
        if (modal.modal.style.display === 'block') {
            modal.adjustModalPosition();
        }
    });
});

// 工具函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}