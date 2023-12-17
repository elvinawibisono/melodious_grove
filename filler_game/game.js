
window.onload = function () {
    const canvas = document.getElementById('audioCanvas');
    const ctx = canvas.getContext('2d');

    const sensitivity = 50;
    let isDrawing = false;
    let path = [];
    let startImagePoint; // Variable to store the starting point of the reference wave
    let endImagePoint;   // Variable to store the ending point of the reference wave


    // Audio setup
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    drawReferenceWave();

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    console.log(startImagePoint.y)
    // console.log(endImagePoint)

    const startImage = new Image();
    const endImage = new Image();

    startImage.src = '../assets/home.png'; // Replace 'start.png' with the path to your start image

    startImage.style.position = "absolute";
    startImage.style.left = startImagePoint.x +"px";
    startImage.style.top = startImagePoint.y +"px";

    console.log( startImage.style.top )

    startImage.style.width = "200px"; // Replace with your desired width
    startImage.style.height = "auto"; 

    startImage.style.userSelect = "none";
    startImage.style.webkitUserSelect = "none";
    startImage.style.msUserSelect = "none";

    document.body.appendChild(startImage);

    endImage.src = '../assets/forest.png';   

    endImage.style.position = "absolute"; 
    endImage.style.left = endImagePoint.x +200 + "px"; 
    endImage.style.top = endImagePoint.y + "px";

    endImage.style.width = "200px"; // Replace with your desired width
    startImage.style.height = "auto"; 
    
    endImage.style.userSelect = "none";
    endImage.style.webkitUserSelect = "none";
    endImage.style.msUserSelect = "none";
    

    document.body.appendChild(endImage);

    function startDrawing(e) {
        isDrawing = true;
        path = [];
        path.push({ x: e.offsetX, y: e.offsetY });
    }

    function draw(e) {
        if (!isDrawing) return;

        const currentPoint = { x: e.offsetX, y: e.offsetY };
        path.push(currentPoint);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the reference wave
        drawReferenceWave();

        // Draw the user's path
        drawPath();

        const { averageAmplitude, amplitudeRange } = calculateAmplitude(path);
        const normalizedAmplitude = amplitudeRange === 0 ? 0 : amplitudeRange / canvas.height;

        const minPitch = 10; // Adjust as needed
        const maxPitch = 30;
        const pitchRange = maxPitch - minPitch;

        const pitch = minPitch + sensitivity * normalizedAmplitude * pitchRange;

        // Adjust the pitch dynamically
        oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);

        // Check if the user has won or lost
        checkWinCondition();

        // Log the coordinates of the current point
        console.log('Current Point:', currentPoint);
        console.log('Normalized Amplitude:', normalizedAmplitude);
        console.log('Pitch:', pitch);
    }

    function drawReferenceWave() {
        const referenceWave = generateReferenceWave();
        drawWave(referenceWave, '#76552b');

      

        // if (startImagePoint) {
        //     drawImageAtPoint(startImagePoint, startImage);
        // }

        // if (endImagePoint) {
        //     drawImageAtPoint(endImagePoint, endImage);
        // }
    }
    

    function drawPath() {
        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length - 1; i++) {
            const xc = (path[i].x + path[i + 1].x) / 2;
            const yc = (path[i].y + path[i + 1].y) / 2;
            ctx.quadraticCurveTo(path[i].x, path[i].y, xc, yc);
        }

        ctx.lineTo(path[path.length - 1].x, path[path.length - 1].y);

        ctx.stroke();
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function calculateAmplitude(path) {
        let maxAmplitude = Number.MIN_VALUE;
        let minAmplitude = Number.MAX_VALUE;
        let totalAmplitude = 0;

        for (let i = 0; i < path.length; i++) {
            const y = path[i].y;
            totalAmplitude += y;

            if (y > maxAmplitude) {
                maxAmplitude = y;
            }

            if (y < minAmplitude) {
                minAmplitude = y;
            }
        }

        const averageAmplitude = totalAmplitude / path.length;
        const amplitudeRange = maxAmplitude - minAmplitude;

        return { averageAmplitude, amplitudeRange };
    }

    function drawWave(wave, color) {
        const lineWidth = 50;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(wave[0].x, wave[0].y);

        for (let i = 1; i < wave.length; i++) {
            ctx.lineTo(wave[i].x, wave[i].y);
        }

        startImagePoint = wave[0];
        endImagePoint = wave[wave.length - 1];

        ctx.stroke();
        ctx.lineWidth = 5; 
       
    }

    function generateReferenceWave() {
        const wave = [];
        const amplitude = canvas.height / 4;
        const frequency = 0.02;

        for (let x = 0; x < canvas.width; x += 10) {
            const y = (canvas.height / 2) + amplitude * Math.sin(frequency * x);
            wave.push({ x, y });
        }

        return wave;
    }


   


    let isDrawingEnded = false;

    canvas.addEventListener('mouseup', function () {
        console.log(isDrawingEnded)
        stopDrawing();
        isDrawing = false;
        isDrawingEnded = true;
        // Check the win condition when the user stops drawing
        checkWinCondition();
    });


    function checkWinCondition() {
        console.log("check")
        console.log(isDrawingEnded)
        if (!isDrawingEnded) {
            return;
        }
    
        const lineWidth = 50; // Set the reference line width
        const referenceWave = generateReferenceWave();
        let withinRangeCount = 0;

        console.log(referenceWave)

        console.log(path)
    
        // for (let i = 0; i < path.length && i < referenceWave.length; i++) {
        for (let i = 0; i < path.length; i++) {
            let point = path[i];
            for (let j = 0; j < referenceWave.length; j++) {
                let referencePoint = referenceWave[j]
                const halfWidth = lineWidth / 2;
                if (Math.hypot(path[i].x - referencePoint.x, path[i].y - referencePoint.y) <= halfWidth) {
                    withinRangeCount++ // Point is within the region
                    break;
                }
            }
            
 
        }
    
        const percentageWithinRange = (withinRangeCount / path.length) * 100;
    
        console.log(`Percentage within range: ${percentageWithinRange}%`);
        
        // If a certain percentage of points are within the line width, consider it a win
        const winThresholdPercentage = 70; // Adjust as needed
        console.log(path[path.length-1].x - path[0].x)
    
        if (path[path.length-1].x - path[0].x >= 600 && percentageWithinRange >= winThresholdPercentage) {
            console.log('Congratulations! You won!');
            // window.alert("you won!")
            document.getElementById('nextGamePopup').style.display = 'block';
            // You can add additional logic here for winning actions.
        } else {
            console.log('Sorry, you lost. The drawing deviates too much from the reference wave.');
            window.alert("please retry")
            // You can add additional logic here for losing actions.
        }
    }
    
    
};



