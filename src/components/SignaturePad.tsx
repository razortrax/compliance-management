"use client";
import React, { useRef, useEffect } from 'react';

interface SignaturePadProps {
  onSignatureEnd: (signatureDataUrl: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing.current = true;
      const pos = getMousePos(canvas, e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      const pos = getMousePos(canvas, e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      isDrawing.current = false;
      onSignatureEnd(canvas.toDataURL());
    };

    const getMousePos = (canvasDom: HTMLCanvasElement, mouseEvent: MouseEvent | TouchEvent) => {
      const rect = canvasDom.getBoundingClientRect();
      const event = 'touches' in mouseEvent ? mouseEvent.touches[0] : mouseEvent;
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    // Desktop events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Mobile events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [onSignatureEnd]);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onSignatureEnd('');
      }
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="border border-gray-400 rounded-md w-full h-32"
        style={{ touchAction: 'none' }}
      ></canvas>
      <button
        type="button"
        onClick={clearSignature}
        className="text-sm text-blue-600 hover:underline mt-2"
      >
        Clear Signature
      </button>
    </div>
  );
};

export default SignaturePad; 