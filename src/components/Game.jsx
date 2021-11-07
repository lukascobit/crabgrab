import React, { useEffect, useRef, useState } from 'react'
import alien from "./imgs/alien.png"
import alien1 from "./imgs/alien1.png"


const l = Math.floor(Math.random() * 50);
const canvasColor = 'hsl(240, 50%,' + l + '%)';
var score = 0

const enemyImg = new Image()
if(Math.round(Math.random())){
  enemyImg.src = alien
}else{
  enemyImg.src = alien1
}


const blockSize = 50
var size = Math.round(window.innerHeight/140)*(blockSize*2.7)
var playerCoords = {
  x: Math.round(size/50)*25,
  y: 600
}
var enemyCoords = {}


function Game() {
    const [inter, setInter] = useState(130)
    const canvasRef = useRef(null)

    //initial draw
    const draw = (c) => {
      c.fillStyle = "#378f83"
      c.fillRect(playerCoords.x,playerCoords.y,blockSize,blockSize)
      c.fillStyle = "red"

      enemyCoords = {
        x: Math.round(Math.random()*size/50)*50,
        y: 0
      }
      c.drawImage(enemyImg, enemyCoords.x,enemyCoords.y,blockSize,blockSize)

      
      setInterval(() => {
        c.fillStyle = "red"
        c.clearRect(enemyCoords.x,enemyCoords.y,blockSize,blockSize)
        enemyCoords = {
          x: enemyCoords.x,
          y: enemyCoords.y + blockSize
        }
        if(enemyCoords.y > size){
          localStorage.setItem("score", score)
          window.location = "fail"
          return
        }

        if(JSON.stringify(enemyCoords) === JSON.stringify(playerCoords)){
          catched()
          return
        }

        c.drawImage(enemyImg, enemyCoords.x,enemyCoords.y,blockSize,blockSize)
        setInter(inter+10)
        console.log(inter);
      }, inter);
      
    }
    function catched(){
      if(Math.round(Math.random())){
        enemyImg.src = alien
      }else{
        enemyImg.src = alien1
      }      
      enemyCoords = {
        x: Math.round(Math.random()*size/50)*50,
        y: 0
      }
      score++
    }
    function move(e){
      const canvas = canvasRef.current
      const c = canvas.getContext('2d');
      c.clearRect(playerCoords.x, playerCoords.y, blockSize, blockSize);
  
      switch(e.key || e){
        case "a":
        case "A":
          if(playerCoords.x <= 0) {
            playerCoords.x = size 
          }
          playerCoords.x -= blockSize
          break;
        case "d":
        case "D":
          if(playerCoords.x >= size-50) {
            playerCoords.x = -50
          }
          playerCoords.x += blockSize
          break;
        default:
          break
        }
        c.fillStyle = "#378f83"
       c.fillRect(playerCoords.x,playerCoords.y, blockSize, blockSize);

      if(JSON.stringify(enemyCoords) === JSON.stringify(playerCoords)){
        catched()
        return;
      }
      
    }
    useEffect(() => {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      window.document.addEventListener('keypress',e => move(e, context))
      draw(context)
    }, [])
    return (
        <div>
        <title>Catch game</title>
        <canvas
        style={{backgroundColor: canvasColor}}
        id="canvas"
        ref={canvasRef}
        width={size}
        height={size}
        />
        </div>
    )
}

export default Game
