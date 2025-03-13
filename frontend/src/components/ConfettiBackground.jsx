import React, { useRef, useState } from 'react';
import { PtsCanvas } from 'react-pts-canvas';
import { Pt, Group, Triangle, Rectangle, Const, Util } from 'pts';

const ConfettiBackground = () => {
  const pts = useRef(new Group());
  const [space, setSpace] = useState(null);

  // Confetti extends Pt to implement custom logic and rendering
  class Confetti extends Pt {
    constructor(...args) {
      super(...args);
      this.color = ["#f03", "#09f", "#0c6", "#fff"][Util.randomInt(4)];
      this.size = Math.random() * 7 + 2;
      this.angle = Math.random() * Const.two_pi;
      this.dir = (Math.random() > 0.5) ? 1 : -1;
      this.shape = ["rect", "circle", "tri"][Util.randomInt(3)];
    }

    render(form) {
      if (this.y < this.space.size.y) {
        this.y += 2 / this.size + Math.random();
        this.x += Math.random() - Math.random();
        this.angle += this.dir * (Math.random() * Const.one_degree + Const.one_degree);

        if (this.shape === "tri" || this.shape === "rect") {
          const shape = (this.shape === "tri")
            ? Triangle.fromCenter(this, this.size)
            : Rectangle.corners(Rectangle.fromCenter(this, this.size * 2));
          shape.rotate2D(this.angle, this);
          form.fillOnly(this.color).polygon(shape);
        } else {
          form.fillOnly(this.color).point(this, this.size, "circle");
        }
      }
    }
  }

  const onAnimate = (space, form, time, ftime) => {
    // Remove confetti if reaching the bottom or too many
    if (pts.current.length > 1000 || (pts.current.length > 0 && pts.current[0].y > space.size.y)) {
      pts.current.shift();
    }

    // Add a confetti every second
    if (Math.floor(time % 1000) > 980) {
      pts.current.push(new Confetti(space.pointer));
    }

    // Render the confetti
    pts.current.forEach(p => {
      p.space = space; // Pass the space object to the Confetti instance
      p.render(form);
    });
  };

  const onAction = (space, form, type, px, py) => {
    // Add a point to the line when mouse moves
    if (type === "move") {
      const confetti = new Confetti(px, py);
      confetti.space = space; // Pass the space object to the Confetti instance
      pts.current.push(confetti);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <PtsCanvas
        background="#fbbd08"
        onAnimate={onAnimate}
        onAction={onAction}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ConfettiBackground;