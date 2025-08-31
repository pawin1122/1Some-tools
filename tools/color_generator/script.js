document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const colorPickers = document.querySelectorAll('.color-picker');
    const colorCodes = document.querySelectorAll('.color-code');
    const generateBtn = document.getElementById('generate-btn');
    const cssOutput = document.getElementById('css-output');
    const copyBtn = document.getElementById('copy-btn');
    const colorPreviews = document.querySelectorAll('.color-preview');

    // 同步颜色选择器和颜色代码输入框
    colorPickers.forEach((picker, index) => {
        picker.addEventListener('input', function() {
            colorCodes[index].value = this.value;
            updateColorPreview(index, this.value);
        });
    });

    colorCodes.forEach((code, index) => {
        code.addEventListener('input', function() {
            // 验证颜色代码格式
            if (/^#([0-9A-F]{3}){1,2}$/i.test(this.value)) {
                colorPickers[index].value = this.value;
                updateColorPreview(index, this.value);
            }
        });
    });

    // 更新颜色预览
    function updateColorPreview(index, color) {
        colorPreviews[index].style.backgroundColor = color;
        // 为确保文本可读性，根据背景色亮度设置文本颜色
        const luminance = getLuminance(color);
        colorPreviews[index].style.color = luminance > 0.5 ? 'black' : 'white';
        colorPreviews[index].textContent = color;
    }

    // 计算颜色亮度 (0-1)
    function getLuminance(color) {
        // 移除#号
        color = color.replace('#', '');

        // 解析RGB值
        let r, g, b;
        if (color.length === 3) {
            r = parseInt(color[0] + color[0], 16);
            g = parseInt(color[1] + color[1], 16);
            b = parseInt(color[2] + color[2], 16);
        } else {
            r = parseInt(color.substring(0, 2), 16);
            g = parseInt(color.substring(2, 4), 16);
            b = parseInt(color.substring(4, 6), 16);
        }

        // 转换为线性RGB并计算亮度
        r /= 255;
        g /= 255;
        b /= 255;

        const linearR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
        const linearG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
        const linearB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

        return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
    }

    // 生成CSS
    generateBtn.addEventListener('click', function() {
        const color1 = colorCodes[0].value;
        const color2 = colorCodes[1].value;
        const color3 = colorCodes[2].value;
        const color4 = colorCodes[3].value;

        const css = `:root {
    --primary-color: ${color1};
    --secondary-color: ${color2};
    --accent-color: ${color3};
    --warning-color: ${color4};

    /* 自动生成的辅助色 */
    --primary-light: ${lightenColor(color1, 20)};
    --primary-dark: ${darkenColor(color1, 20)};
    --secondary-light: ${lightenColor(color2, 20)};
    --secondary-dark: ${darkenColor(color2, 20)};
    --accent-light: ${lightenColor(color3, 20)};
    --accent-dark: ${darkenColor(color3, 20)};
    --warning-light: ${lightenColor(color4, 20)};
    --warning-dark: ${darkenColor(color4, 20)};
}`;

        cssOutput.textContent = css;
    });

    // 复制CSS到剪贴板
    copyBtn.addEventListener('click', function() {
        cssOutput.select();
        document.execCommand('copy');

        // 显示复制成功提示
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '复制成功!';
        copyBtn.style.backgroundColor = '#2ecc71';

        setTimeout(function() {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    });

    // 加深颜色
    function darkenColor(color, amount) {
        return adjustColor(color, -amount);
    }

    // 减淡颜色
    function lightenColor(color, amount) {
        return adjustColor(color, amount);
    }

    // 调整颜色亮度
    function adjustColor(color, amount) {
        // 移除#号
        color = color.replace('#', '');

        // 解析RGB值
        let r, g, b;
        if (color.length === 3) {
            r = parseInt(color[0] + color[0], 16);
            g = parseInt(color[1] + color[1], 16);
            b = parseInt(color[2] + color[2], 16);
        } else {
            r = parseInt(color.substring(0, 2), 16);
            g = parseInt(color.substring(2, 4), 16);
            b = parseInt(color.substring(4, 6), 16);
        }

        // 调整亮度
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));

        // 转换回十六进制
        const toHex = function(c) {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return '#' + toHex(Math.round(r)) + toHex(Math.round(g)) + toHex(Math.round(b));
    }

    // 初始化颜色预览
    colorCodes.forEach((code, index) => {
        updateColorPreview(index, code.value);
    });

    // 生成初始CSS
    generateBtn.click();
});