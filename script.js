function Task(unitSize, duration) {
    this.unitSize = unitSize;
    this.remainingTime = duration;
    this.assignedBlock = null;
    this.id = taskID++;

    this.isAssigned = function() {
        return this.assignedBlock !== null;
    };

    this.decrementTime = function() {
        this.remainingTime--;
    };
}

function MemoryUnit(size) {
    this.size = size;
    this.task = null;
    this.available = true;
    this.next = null;
    this.previous = null;
    this.subPartition = false;

    this.assignTask = function(task) {
        if (task == null) {
            this.task = null;
            this.available = true;
        } else {
            this.task = task;
            this.available = false;
        }
    };
}

function MemoryManager() {
    this.head = null;
    this.totalSize = 0;

    this.initializeMemory = function(size) {
        this.head = new MemoryUnit(size);
        this.totalSize = size;
    };

    this.allocateTask = function(task) {
        let bestFitBlock = this.head;
        while ((bestFitBlock.size < task.unitSize) || (!bestFitBlock.available)) {
            bestFitBlock = bestFitBlock.next;
            if (bestFitBlock === null) return false;
        }

        let currentBlock = bestFitBlock.next;
        while (currentBlock !== null) {
            if (currentBlock.size >= task.unitSize && currentBlock.available && currentBlock.size < bestFitBlock.size) {
                bestFitBlock = currentBlock;
            }
            currentBlock = currentBlock.next;
        }

        let remainingSpace = bestFitBlock.size - task.unitSize;
        if (remainingSpace > 0) {
            let newBlock = new MemoryUnit(remainingSpace);
            let nextBlock = bestFitBlock.next;
            if (nextBlock !== null) {
                nextBlock.previous = newBlock;
                newBlock.next = nextBlock;
            }
            bestFitBlock.next = newBlock;
            newBlock.previous = bestFitBlock;
            bestFitBlock.size = task.unitSize;
            newBlock.subPartition = true;
        }

        bestFitBlock.assignTask(task);
        task.assignedBlock = bestFitBlock;
        return true;
    };

    this.deallocateTask = function(task) {
        if (task.assignedBlock !== null) {
            task.assignedBlock.assignTask(null);
            this.mergeFreeBlocks();
        }
    };

    this.mergeFreeBlocks = function() {
        let currentBlock = this.head;
        while (currentBlock !== null) {
            if (currentBlock.available && currentBlock.next !== null && currentBlock.next.available) {
                currentBlock.size += currentBlock.next.size;
                currentBlock.next = currentBlock.next.next;
                if (currentBlock.next !== null) {
                    currentBlock.next.previous = currentBlock;
                }
            } else {
                currentBlock = currentBlock.next;
            }
        }
    };

    this.updateMemoryDisplay = function() {
        let memoryDisplay = document.getElementById('memoryDisplay');
        memoryDisplay.innerHTML = '';
        let currentBlock = this.head;
        while (currentBlock !== null) {
            let blockDiv = document.createElement('div');
            blockDiv.className = 'memory-block';
            blockDiv.style.width = `${(currentBlock.size / this.totalSize) * 100}%`;
            blockDiv.style.backgroundColor = currentBlock.available ? '#27ae60' : '#c0392b';
            blockDiv.textContent = `${currentBlock.size} KB`;
            memoryDisplay.appendChild(blockDiv);
            currentBlock = currentBlock.next;
        }
    };
}

var taskID = 0;
var memoryBlockSize = 16;
var memoryManager = new MemoryManager();
memoryManager.initializeMemory(1024); // Initialize memory with 1024 KB

var tasks = [];

function addTask(size, duration) {
    let task = new Task(size, duration);
    if (memoryManager.allocateTask(task)) {
        tasks.push(task);
        updateTaskQueue();
        memoryManager.updateMemoryDisplay();
    } else {
        alert('Not enough memory to allocate task!');
    }
}

function updateTaskQueue() {
    let taskTable = document.getElementById('taskTable');
    taskTable.innerHTML = '<tr><th>ID</th><th>Size (KB)</th><th>Time Left</th></tr>';
    tasks.forEach(task => {
        let row = taskTable.insertRow();
        row.insertCell().textContent = task.id;
        row.insertCell().textContent = task.unitSize;
        row.insertCell().textContent = task.remainingTime;
    });
}

function simulateTimeStep() {
    tasks.forEach((task, index) => {
        task.decrementTime();
        if (task.remainingTime <= 0) {
            memoryManager.deallocateTask(task);
            tasks.splice(index, 1);
        }
    });
    updateTaskQueue();
    memoryManager.updateMemoryDisplay();
}

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let taskSize = parseInt(document.querySelector('input[name="taskSize"]').value);
    let taskDuration = parseInt(document.querySelector('input[name="taskDuration"]').value);
    if (!isNaN(taskSize) && !isNaN(taskDuration)) {
        addTask(taskSize, taskDuration);
    } else {
        alert('Please enter valid numbers for task size and duration.');
    }
});

setInterval(simulateTimeStep, 1000); // Simulate time step every second