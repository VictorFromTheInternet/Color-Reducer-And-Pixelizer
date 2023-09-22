
let pixelatedImageContainer = document.getElementById("pixelated-image-container");

let pixelImg = new Image();
let c;
let ctx;
let pixelArr;
let sampleValuesArr = new Array();
let mostCommonColors = new Array();
let numColors = 5;
let pixelSampleSize = 10;

let imgHeight = 0;
let imgWidth = 0;

//btns
let btnReduceColors = document.getElementById("btnReduceColors")
let btnPixelateImage = document.getElementById("btnPixelateImage")

// lodaing spinner for buttons
let spinnerElem = document.createElement("span");
spinnerElem.classList.add("spinner-border");
spinnerElem.classList.add("spinner-border-sm");
//spinnerElem.role = "status"
//spinnerElem.aria-hidden = "true";


// output range field vales to labels
document.getElementById("pixel-sample-size").addEventListener("input", ()=>{
    pixelSampleSize = Number(document.getElementById("pixel-sample-size").value);
    document.getElementById("pixel-sample-size-range-label").innerText = pixelSampleSize;
    //console.log(pixelSampleSize)
})
document.getElementById("num-colors").addEventListener("input", ()=>{
    numColors = Number(document.getElementById("num-colors").value);
    document.getElementById("num-colors-range-label").innerText = numColors;
    //console.log(numColors)
})

// sorting functions for the color reducer
function ascendingOrder(a, b) {
    const strA = a.toUpperCase(); // ignore upper and lowercase
    const strB = b.toUpperCase(); // ignore upper and lowercase
    if (strA < strB) {
      return -1;
    }
    if (strA > strB) {
      return 1;
    }
  
    // strings must be equal
    return 0;
};

function descendingOrder(a, b) {
    const strA = a.toUpperCase(); // ignore upper and lowercase
    const strB = b.toUpperCase(); // ignore upper and lowercase
    if (strA > strB) {
      return -1;
    }
    if (strA < strB) {
      return 1;
    }
  
    // strings must be equal
    return 0;
};

// returns arr of n most common colors (expects sorted array)
function mostCommon(numColors, colorsArray){
    // console.log("Num Colors: ", numColors);
    // console.log("Colors Array: ", colorsArray);

    let mostCommonColors = []; // array to return

    // find the most common color N times, after each loop ...
    for(let i=0; i<numColors; i++){
        let maxCount = 1;      
        let maxVal = colorsArray[0];  
        let tempCount = 1;   
        let tempVal = colorsArray[0];                

        // iterate and update maxVal
        for(let i=0; i<colorsArray.length; i++){
            
            tempVal = colorsArray[i]

            // update
            if( tempVal === colorsArray[i+1]){ // assuming arr is sorted
                // console.log("\nIndex: ",i)
                // console.log("Temp Count (inc): ",tempCount, ", Max Count: ",maxCount)
                // console.log("tempVal (inc): ",tempVal," maxVal: ",maxVal)
                tempCount++
            }            
            if(tempCount > maxCount){
                // console.log("\nIndex: ",i)
                // console.log("Temp Count (re): ",tempCount, ", Max Count: ",maxCount)
                // console.log("tempVal (re): ",tempVal," maxVal: ",maxVal)
                maxCount = tempCount
                maxVal = tempVal
            }
            if(colorsArray[i] !== colorsArray[i+1]){ // assuming arr is sorted
                // console.log("\nIndex: ",i)
                // console.log("Temp Count (not): ",tempCount, ", Max Count: ",maxCount)
                // console.log("tempVal (not): ",tempVal," maxVal: ",maxVal)
                tempCount = 1
            }
   
        }  

        //add maxVal to returnArr
        mostCommonColors.push(maxVal)

        //remove color from colorArray  
        //console.log("Colors Before: ", colorsArray)
        while(-1 !== colorsArray.findIndex((element) => element === maxVal)){
            let tempIndex = colorsArray.findIndex((element) => element === maxVal);
            colorsArray.splice(tempIndex,1);
        }
        //console.log("Colors After: ",colorsArray)
    }
    //console.log("\nMost Common: ",mostCommonColors);

    return mostCommonColors;
}

//color rounding function (assigning values)

// closest color
function closestColor(rgbVal, compareVals){
    let rgbRegex = /rgb\( (\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
    let matches = rgbRegex.exec(rgbVal);

    let rOne = matches[1];
    let gOne = matches[2];
    let bOne = matches[3];

    let minDistance = 0;
    let minVal;
    let minIndex;
    let currDistance = 0;

    // iterate and then update the minDistance
    for(let i=0; i<compareVals.length; i++){
        let matchesTwo = rgbRegex.exec(compareVals[i])
        let rTwo = matchesTwo[1]
        let gTwo = matchesTwo[2]
        let bTwo = matchesTwo[3]

        currDistance = Math.sqrt( Math.pow(rOne - rTwo ,2) + Math.pow( gOne - gTwo ,2) + Math.pow(bOne - bTwo ,2) )
        //console.log(currDistance)

        if(i == 0){ // init minDistance
            minDistance = currDistance;
            minIndex = i;
            minVal = compareVals[i];
        }
        else if(currDistance < minDistance){
            minDistance = currDistance;
            minIndex = i;
            minVal = compareVals[i];
        }
    }

    //return `${minVal}, was the closest value: ${minDistance}, at index: ${minIndex}`
    return minVal;
}


// Testing methods
/*
document.getElementById("btnTestRgb").addEventListener("click", ()=>{    

    let rgbVal = "rgb( 30, 30, 30)";
    let compareVals = ["rgb( 50, 50, 50)","rgb( 60, 60, 60)","rgb( 90, 90, 90)"];
    console.log(compareVals)
    console.log(rgbVal," is closest to: ",closestColor(rgbVal,compareVals))
    
})

document.getElementById("btnTestMostCommonColor").addEventListener("click", ()=>{   
    let numColors = 3;
    let colors = ["rgb( 50, 50, 50)","rgb( 50, 50, 50)","rgb( 50, 50, 50)","rgb( 60, 60, 60)","rgb( 90, 90, 90)","rgb( 90, 90, 90)","rgb( 90, 90, 90)","rgb( 90, 90, 90)","rgb( 230, 72, 81)","rgb( 230, 72, 81)"];
    console.log("Colors: ",colors)
    // console.log("The most common color is: ",mostCommonAppearances(numColors,colors));
    console.log("The most common color is: ",mostCommon(numColors,colors));
})
*/
document.getElementById("btnTestClosestColor").addEventListener("click", ()=>{       
    let colors = ["rgb( 50, 50, 50)","rgb( 50, 50, 50)","rgb( 50, 50, 50)","rgb( 60, 60, 60)","rgb( 90, 90, 90)","rgb( 90, 90, 90)","rgb( 90, 90, 90)","rgb( 90, 90, 90)","rgb( 230, 72, 81)","rgb( 230, 72, 81)"];
    console.log("Colors: ",colors)
    let mostCommon = ["rgb( 50, 50, 50)","rgb( 60, 60, 60)","rgb( 90, 90, 90)"]
    console.log("Most common: ", mostCommon)

    // console.log("The most common color is: ",mostCommonAppearances(numColors,colors));
    let roundedColors = new Array();
    for(let i=0; i<colors.length; i++){
        roundedColors[i] = closestColor(colors[i], mostCommon)
    }
    console.log("The rounded colors are: ",roundedColors);
})



//
// btnReduceColors
//
/*
btnReduceColors.addEventListener("click", ()=>{
    //add loading anim to btn
    let spinnerElem = document.createElement("span");
    spinnerElem.classList.add("spinner-border");
    spinnerElem.classList.add("spinner-border-sm");   
    spinnerElem.style.marginRight = ".75rem"
    
    let pText = document.createElement("p");    
    pText.style.display = "inline"
    pText.innerText = "Loading"

    btnReduceColors.innerText = ""
    btnReduceColors.append(spinnerElem)
    btnReduceColors.append(pText)
    
})
*/

btnReduceColors.addEventListener("click", ()=>{  

    // get values
    numColors = Number(document.getElementById("num-colors").value);
    imgHeight = document.getElementById("source-image").height;
    imgWidth = document.getElementById("source-image").width;

    // create canvas element
    c = document.createElement("canvas");
    c.width = imgWidth;
    c.height = imgHeight;

    // use canvas elm and grab the pixel data
    pixelImg = document.getElementById("source-image");
    ctx = c.getContext("2d");
    ctx.drawImage(pixelImg,0,0); // should be an exact copy of source-image atp

    pixelArr = ctx.getImageData(0,0,imgWidth,imgHeight).data;
        //console.log("pixelArr: ", pixelArr);            

    // grab rgb values from pixelArr
    // step through the arr (one pixel at a time)
    for (let y = 0; y < imgHeight; y += 1) { 
        for (let x = 0; x < imgWidth; x += 1) {
            // grab the position/index of the pixel
            let p = (x + (y*imgWidth)) * 4; // (multiply by 4 to skip over the rgba vals) ex: [r,g,b,a, ...]
            let rgbaVal = `rgba( ${pixelArr[p]}, ${pixelArr[p + 1]}, ${pixelArr[p + 2]}, ${pixelArr[p + 3]})`;
            let rgbVal = `rgb( ${pixelArr[p]}, ${pixelArr[p + 1]}, ${pixelArr[p + 2]})`;
            ctx.fillStyle = rgbaVal;
            sampleValuesArr.push(rgbVal);

            // draw a block with the rgba value of the first pixel (top-left) in the sample
            ctx.fillRect(x, y, 1, 1);

        }
    }    

    // sort the array and then count most common appearances
    sampleValuesArr.sort(descendingOrder)
        //console.log("sampleValuesArr: ",sampleValuesArr)

    // get N most common vals
    let mostCommonArr = mostCommon(numColors, sampleValuesArr)
        //console.log("mostCommonArr: ", mostCommonArr)

    // round each index to closest value 
    let roundedArr = sampleValuesArr
    for(let i=0; i<sampleValuesArr; i++){
        roundedArr[i] = closestColor(sampleValuesArr[i], mostCommonArr)
    }
    console.log("roundedArr (str): ", roundedArr);

    // convert the rgb str array back into integers for pixel data
    let reducedRgbArr = new Array()

    for(let i=0; i<roundedArr.length; i++){        
        let rgbRegex = /rgb\( (\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
        let matches = rgbRegex.exec(roundedArr[i]);

        let red = matches[1];
        let green = matches[2];
        let blue = matches[3];

        reducedRgbArr.push(parseInt(red));
        reducedRgbArr.push(parseInt(green));
        reducedRgbArr.push(parseInt(blue));
        reducedRgbArr.push(255);
    }
    console.log("reducedRgbArr (int): ",reducedRgbArr)
    console.log("c.data before: ",c.data)
    c.data = reducedRgbArr
    console.log("c.data After: ",c.data)

    // assign image data to outputImage
    let outputImage = new Image();    
    outputImage.src = c.toDataURL("image/jpeg");  
    console.log("outpuImg.src: ",outputImage.src)  
    outputImage.classList.add("pixelated"); // add a class name to target elem later to clean dom
    outputImage.width = imgWidth;   

    // append the new image to the dom
    pixelatedImageContainer.append(outputImage);

    // remove loading anim
    //remove(".spinnerElem")
    //btnReduceColors.innerText = "Reduce Colors"

})


//
// btnPixelatedImage (edit this function to get the source from the color reduced image)
//
btnPixelateImage.addEventListener("click",()=>{
    imgHeight = document.getElementById("source-image").height;
    imgWidth = document.getElementById("source-image").width;
    pixelSampleSize = Number(document.getElementById("pixel-sample-size").value);

    // create canvas element
    c = document.createElement("canvas");
    c.width = imgWidth;
    c.height = imgHeight;
        //console.log(c.data)

    // use canvas elm and grab the pixel data
    pixelImg = document.getElementById("source-image");
    ctx = c.getContext("2d");
    ctx.drawImage(pixelImg,0,0); // should be an exact copy of source-image atp

    pixelArr = ctx.getImageData(0,0,imgWidth,imgHeight).data;
    console.log(pixelArr);            

    // pixelate 
    // step through the arr (one sample size at a time)
    for (let y = 0; y < imgHeight; y += pixelSampleSize) { 
        for (let x = 0; x < imgWidth; x += pixelSampleSize) {
            // grab the position/index of the pixel
            let p = (x + (y*imgWidth)) * 4; // (multiply by 4 to skip over the rgba vals) ex: [r,g,b,a, ...]
            let rgbaVal = `rgba( ${pixelArr[p]}, ${pixelArr[p + 1]}, ${pixelArr[p + 2]}, ${pixelArr[p + 3]})`;
            let rgbVal = `rgb( ${pixelArr[p]}, ${pixelArr[p + 1]}, ${pixelArr[p + 2]})`;
            ctx.fillStyle = rgbaVal;
            sampleValuesArr.push(rgbVal);

            // draw a block with the rgba value of the first pixel (top-left) in the sample
            ctx.fillRect(x, y, pixelSampleSize, pixelSampleSize);

        }
    }
    console.log(sampleValuesArr)


    // assign image data to outputImage
    let outputImage = new Image();
    outputImage.src = c.toDataURL("image/jpeg");    
    outputImage.classList.add("pixelated"); // add a class name to target elem later to clean dom
    outputImage.width = imgWidth;   

    // append the new image to the dom
    pixelatedImageContainer.append(outputImage);

    
})


// function to remove elements by class name from dom
const remove = (className) => document.querySelectorAll(className).forEach(el => el.remove());

//btnClearOutput 
document.getElementById("btnClearOutput").addEventListener("click", ()=>{
    console.log("Button clear output clicked")

    remove(".pixelated"); // remove all elments with the className: pixelated
})