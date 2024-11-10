<template>
  <div>
    <canvas class="d-block" ref="canvas" :width="boundaryX" :height="boundaryY"></canvas>
    <div class="d-block text-center mt-5 h3">Loading, please wait...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      points: [],
      velocity2: 5, // velocity squared
      radius: 5,
      boundaryX: 200,
      boundaryY: 200,
      numberOfPoints: 30
    };
  },
  mounted() {
    this.context = this.$refs.canvas.getContext("2d");
    this.init();
  },
  methods: {
    init() {
      // Create points
      for (let i = 0; i < this.numberOfPoints; i++) {
        this.createPoint();
      }
      // Create connections
      for (let i = 0; i < this.points.length; i++) {
        if (i === 0) {
          this.points[i].buddy = this.points[this.points.length - 1];
        } else {
          this.points[i].buddy = this.points[i - 1];
        }
      }
      // Animate
      this.animate();
    },
    createPoint() {
      const point = {};
      let vx2, vy2;
      point.x = Math.random() * this.boundaryX;
      point.y = Math.random() * this.boundaryY;
      // Random vx
      point.vx = (Math.floor(Math.random()) * 2 - 1) * Math.random();
      vx2 = Math.pow(point.vx, 2);
      // vy^2 = velocity^2 - vx^2
      vy2 = this.velocity2 - vx2;
      point.vy = Math.sqrt(vy2) * (Math.random() * 2 - 1);
      this.points.push(point);
    },
    resetVelocity(point, axis, dir) {
      let vx2, vy2;
      if (axis === "x") {
        point.vx = dir * Math.random();
        vx2 = Math.pow(point.vx, 2);
        // vy^2 = velocity^2 - vx^2
        vy2 = this.velocity2 - vx2;
        point.vy = Math.sqrt(vy2) * (Math.random() * 2 - 1);
      } else {
        point.vy = dir * Math.random();
        vy2 = Math.pow(point.vy, 2);
        // vx^2 = velocity^2 - vy^2
        vx2 = this.velocity2 - vy2;
        point.vx = Math.sqrt(vx2) * (Math.random() * 2 - 1);
      }
    },
    drawCircle(x, y) {
      this.context.beginPath();
      this.context.arc(x, y, this.radius, 0, 2 * Math.PI, false);
      this.context.fillStyle = "#97badc";
      this.context.fill();
    },
    drawLine(x1, y1, x2, y2) {
      this.context.beginPath();
      this.context.moveTo(x1, y1);
      this.context.lineTo(x2, y2);
      this.context.strokeStyle = "#8ab2d8";
      this.context.stroke();
    },
    draw() {
      for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        point.x += point.vx;
        point.y += point.vy;
        this.drawCircle(point.x, point.y);
        this.drawLine(point.x, point.y, point.buddy.x, point.buddy.y);
        // Check for edge
        if (point.x < 0 + this.radius) {
          this.resetVelocity(point, "x", 1);
        } else if (point.x > this.boundaryX - this.radius) {
          this.resetVelocity(point, "x", -1);
        } else if (point.y < 0 + this.radius) {
          this.resetVelocity(point, "y", 1);
        } else if (point.y > this.boundaryY - this.radius) {
          this.resetVelocity(point, "y", -1);
        }
      }
    },
    animate() {
      this.context.clearRect(0, 0, this.boundaryX, this.boundaryY);
      this.draw();
      requestAnimationFrame(this.animate);
    }
  }
};
</script>

<style scoped>

canvas {
  transform: rotate(45deg);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
