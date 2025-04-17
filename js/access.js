// 检查访问权限
function checkAccess() {
    const accessData = localStorage.getItem('accessData');
    if (accessData) {
        const { expiryDate } = JSON.parse(accessData);
        if (new Date().getTime() < expiryDate) {
            document.getElementById('accessOverlay').style.display = 'none';
            document.querySelector('.container').style.display = 'block';
            return;
        }
    }
    document.getElementById('accessOverlay').style.display = 'flex';
    document.querySelector('.container').style.display = 'none';
}

// 验证访问码
function verifyAccess() {
    const accessCode = document.getElementById('accessCode').value;
    const today = new Date();
    const expectedCode = today.getFullYear().toString() +
        String(today.getMonth() + 1).padStart(2, '0') +
        String(today.getDate()).padStart(2, '0');

    if (accessCode === expectedCode) {
        // 设置30天的访问权限
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        localStorage.setItem('accessData', JSON.stringify({
            expiryDate: expiryDate.getTime()
        }));

        document.getElementById('accessOverlay').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
        document.getElementById('errorMessage').textContent = '';
    } else {
        document.getElementById('errorMessage').textContent = '访问码错误，请重试';
    }
}

// 页面加载时检查访问权限
document.addEventListener('DOMContentLoaded', checkAccess); 