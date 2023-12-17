window.onload = function () {
    const canvas = document.getElementById('audioCanvas');
    const ctx = canvas.getContext('2d');

    const referenceWave = generateReferenceWave();
    const tolerance = 30; // Adjust the tolerance level

    let isDrawing = false;
    let path = [];

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        path = [];
        path.push({ x: e.offsetX, y: e.offsetY });
    }

    function draw(e) {
        if (!isDrawing) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the reference wave
        drawWave(referenceWave, '#00FF00');

        // Draw the user's path
        drawPath();

        // Draw a line connecting the user's last point to the reference wave
        const lastPoint = path[path.length - 1];
        ctx.strokeStyle = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(referenceWave[referenceWave.length - 1].x, lastPoint.y);
        ctx.stroke();
    }

    function drawWave(wave, color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(wave[0].x, wave[0].y);

        for (let i = 1; i < wave.length; i++) {
            ctx.lineTo(wave[i].x, wave[i].y);
        }

        ctx.stroke();
    }

    function drawPath() {
        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }

        ctx.stroke();
    }

    function stopDrawing() {
        isDrawing = false;

        // Compare the user's path with the reference wave
        const match = compareWaves(path, referenceWave, tolerance);

        if (match) {
            console.log('Match! Play high pitch');
            // Play high pitch sound
        } else {
            console.log('Not a match. Play low pitch');
            // Play low pitch sound
        }
    }

    function generateReferenceWave() {
        const wave = [];
        const amplitude = canvas.height / 2;
        const frequency = 0.02;

        for (let x = 0; x < canvas.width; x += 10) {
            const y = amplitude * Math.sin(frequency * x);
            wave.push({ x, y });
        }

        return wave;
    }

    function compareWaves(path, reference, tolerance) {
        if (path.length !== reference.length) return false;

        for (let i = 0; i < path.length; i++) {
            if (Math.abs(path[i].y - reference[i].y) > tolerance) {
                return false;
            }
        }

        return true;
    }
}