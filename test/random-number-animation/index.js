let intervalId = null;  
let currentNumber = 0;  
  
document.getElementById('startBtn').addEventListener('click', function() {  
    this.disabled = true;  
    document.getElementById('pauseBtn').disabled = false;  
    intervalId = setInterval(updateNumber, 400);  
});  
  
document.getElementById('pauseBtn').addEventListener('click', function() {  
    clearInterval(intervalId);  
    this.disabled = true;  
    document.getElementById('startBtn').disabled = false;  
    document.getElementById('currentNumberDisplay').style.display = 'block';  
    document.getElementById('currentNumber').textContent = currentNumber;  
});  
  
function updateNumber() {  
    currentNumber = Math.floor(Math.random() * 10); // 生成0-9之间的随机数  
    document.getElementById('numberDisplay').textContent = currentNumber;  
}