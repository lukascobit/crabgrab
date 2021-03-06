import React, { useEffect, useRef } from 'react'
import alien from "./imgs/alien.png"
import alien1 from "./imgs/alien1.png"
import alien2 from "./imgs/alien2.png"
import alien3 from "./imgs/alien3.png"
import player from "./imgs/crab.png"


const l = Math.floor(Math.random() * 50);
const canvasColor = 'hsl(240, 50%,' + l + '%)';
var score = 0

//SPEED OF THE ENEMIES//
let inter = 2000

const bestScore = localStorage.getItem("bestScore")

const enemyImg = new Image()
const aliens = [alien,alien1,alien2,alien3]
enemyImg.src = aliens[Math.floor(Math.random()*5)]

const playerImg = new Image()
playerImg.src = player


const blockSize = 50
let size = Math.round(window.innerWidth/100)*100
let height = window.innerHeight -50

var playerCoords = {
  x: Math.round(size/50)*25,
  y: 700
}

if(window.innerWidth < 820){
  size = (Math.round(window.innerWidth/100)*100)-100
  height = window.innerHeight
  playerCoords = {
    x: Math.round(size/50)*25,
    y: 600
  }
}

var enemyCoords = {}


function Game() {
    const canvasRef = useRef(null)
    //initial draw
    function draw (c){
      playerImg && c.drawImage(playerImg, playerCoords.x,playerCoords.y,blockSize,blockSize)

      enemyCoords = {
        x: Math.round(Math.random()*(size-50)/50)*50,
        y: 0
      }
      try {
        c.drawImage(enemyImg, enemyCoords.x,enemyCoords.y,blockSize,blockSize)
      } catch (error) {
        console.log(error);
      }

      
      setInterval(() => {
        c.clearRect(150, 30,300,200)
        c.fillStyle = "white"
        c.font = "5vw Arial"
        c.fillText(score, 200, 100)
        c.clearRect(enemyCoords.x,enemyCoords.y,blockSize,blockSize)
        enemyCoords = {
          x: enemyCoords.x,
          y: enemyCoords.y + blockSize
        }
        if(enemyCoords.y > height){
          if(score >= bestScore || !bestScore){
            localStorage.setItem("previousBest" , bestScore)
            localStorage.setItem("bestScore", score)
          }
          localStorage.setItem("score", score)
          window.location = "fail"
          return
        }
        if(JSON.stringify(enemyCoords) === JSON.stringify(playerCoords)){
          catched()
          return
        }
        try {
          enemyImg && c.drawImage(enemyImg, enemyCoords.x,enemyCoords.y,blockSize,blockSize)
        } catch (error) {
          //i know this is dumb, im sorry
          c.fillStyle = "red"
          c.fillRect(enemyCoords.x,enemyCoords.y,blockSize,blockSize)
        }
      }, inter);
      
    }
    function catched(){
      enemyImg.src = aliens[Math.floor(Math.random()*4)]
      enemyCoords = {
        x: Math.round(Math.random()*(size-50)/50)*50,
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
        case "+":
          inter -=100
          c.clearRect(enemyCoords.x,enemyCoords.y,blockSize,blockSize)
          draw(c)
        case "-":
          inter +=100
          c.clearRect(enemyCoords.x,enemyCoords.y,blockSize,blockSize)
          draw(c)
        default:
          break
        }
      console.log(inter);
      playerImg && c.drawImage(playerImg, playerCoords.x,playerCoords.y, blockSize, blockSize);

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
        <div className="game">
          <title>Catch game</title>
          <div onClick={()=>move("a")} className="left"/>
          <div onClick={()=>move("d")} className="right"/>


          <canvas
          style={{backgroundColor: canvasColor}}
          id="canvas"
          ref={canvasRef}
          width={size}
          height={height}
          />
        </div>
    )
}

export default Game
