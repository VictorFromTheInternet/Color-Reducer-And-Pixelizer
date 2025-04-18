/*

    Notes to self: name your global variables better pls o _ o

    current bugs:
        Color Reducer:
            - only a solid color is generated instead of a range of values
                - cause: im pretty sure one of the arrays that im using is now instantiated or reset upon hitting 'reduce colors' a 2nd time
                        so if you reduce the image the first time with only black selected for ex, it will mutate the pixel arr to only include those values

                - fix: the source array for reducing the images colors must come from the image each time (unmutated)


*/
let pixelatedImageContainer = document.getElementById("pixelated-image-container");

let pixelImg = new Image();
let c;
let ctx;
let pixelArr;
//let sampleValuesArr = new Array();
//let mostCommonColors = new Array();
let numColors = 1;

let imgHeight = 0;
let imgWidth = 0;

//let COLOR_INPUTS_ARRAY = new Array();

//btns
let btnReduceColors = document.getElementById("btnReduceColors")

// loading spinner for buttons
let spinnerElem = document.createElement("span");
spinnerElem.classList.add("spinner-border");
spinnerElem.classList.add("spinner-border-sm");

// create color input element and array to store them
// let COLOR_INPUTS_ARRAY = new Array()
// let colorInput = document.createElement("input");
// colorInput.type = "color"
// colorInput.classList.add("form-control")
// colorInput.classList.add("form-control-color")



// output range field vales to labels
document.getElementById("num-colors").addEventListener("input", ()=>{
    numColors = Number(document.getElementById("num-colors").value);
    document.getElementById("num-colors-range-label").innerText = numColors;
    //console.log(numColors)
})

// event listener for the numColors range input (append/remove color inputs)
document.getElementById("num-colors").addEventListener("input", ()=>{
    numColorInputs = document.querySelectorAll(".colorInputs").length
    numColors = Number(document.getElementById("num-colors").value)

    if(numColors > numColorInputs)
        appendColorInputs(numColors)
    else if(numColors < numColorInputs)
        removeColorInputs(numColors)
})
function appendColorInputs(numColors){
    let colorInputsList = document.querySelectorAll(".colorInputs")
    let currLen = colorInputsList.length
    for(let i=currLen; i<numColors; i++){
        let tempElem = document.createElement("input");
        tempElem.type = "color"
        tempElem.classList.add("form-control")
        tempElem.classList.add("form-control-color")
        tempElem.classList.add("colorInputs")
        tempElem.id = `colorInput${i}`
        document.getElementById("color-inputs-container").append(tempElem);
        //colorInputsArr.append(colorInput)
    }
}
function removeColorInputs(numColors){

    // grab curr length and then iterate backwards
    let colorInputsList = document.querySelectorAll(".colorInputs")
    let currLen = colorInputsList.length

    for(let i=currLen; i>numColors; i--){        
        let tempId = `colorInput${i-1}`
        //console.log(tempId)
        //console.log(document.getElementById(`colorInput${i-1}`))


        let tempElem = document.getElementById(tempId)
        tempElem.remove()        
    }
}

// collect color inputs and push to array
function getColorInputValues(){
    // query selector, all 
    let tempArray = new Array()
    let colorInputsList = document.querySelectorAll('.colorInputs')
    console.log(colorInputsList)

    // for(let i=0; i<colorInputsList.length; i++){        
    //     let tempId = colorInputsList.querySelector(`.colorInput${i}`)
    //     console.log(tempId)        
    //     console.log(tempId.value)

    //     let tempValue = tempId.value
    //     tempValue = hexToRgb(tempValue)
    //     tempArray.push(tempValue) 
    // }

    for( elm of colorInputsList){
        console.log(elm)
        tempArray.push(elm.value)
    }

    //console.log(tempArray)
    return tempArray
}
function hexToRgb(hexStr){
    const regex = /^#(.{2})(.{2})(.{2})$/g
    let matches = regex.exec(hexStr)
    
    let red = parseInt(matches[1], 16)
    let green = parseInt(matches[2], 16)
    let blue = parseInt(matches[3], 16)

    return `rgb( ${red}, ${green}, ${blue})`
}

// Testing methods
// function testAppendColorInputs(){
//     let num = Number(document.getElementById("num-colors").value)
//     console.log(num)
//     appendColorInputs(num)
// }
// function testRemoveColorInputs(){
//     let num = Number(document.getElementById("num-colors").value)
//     console.log(num)
//     removeColorInputs(num)
// }

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
    console.log(matches)

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

document.getElementById("btnTestClosestColor").addEventListener("click", ()=>{       
    let colors = ['rgb( 99, 99, 116)', 'rgb( 99, 99, 116)', 'rgb( 99, 98, 113)', 'rgb( 99, 98, 113)', 'rgb( 99, 9, 9)', 'rgb( 99, 9, 9)', 'rgb( 99, 9, 19)', 'rgb( 99, 9, 19)', 'rgb( 99, 9, 17)', 'rgb( 99, 9, 17)', 'rgb( 99, 9, 16)', 'rgb( 99, 9, 16)'];
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
*/



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
    // define arrays
    let sampleValuesArr = new Array()

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
        console.log("Sample Values Arr: ",sampleValuesArr) 

    // sort the array and then count most common appearances
    /*
    sampleValuesArr.sort(descendingOrder)
        console.log("sampleValuesArr: ",sampleValuesArr)
    */

    // get N most common vals (filter values first)
    /*
    let filteredRgbVals = sampleValuesArr.filter( (elem,index)=>{
        let rgbRegex = /rgb\( (\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
        let matches = rgbRegex.exec(elem);

        let red = parseInt(matches[1])
        let green = parseInt(matches[2])
        let blue = parseInt(matches[3])
        let avg = (red+green+blue) /3

        if(avg < 255 && avg >55)
            return elem
    })
    let mostCommonArr = mostCommon(numColors, filteredRgbVals)
        console.log("mostCommonArr: ", mostCommonArr)
    */

    // grab the color input values
    let colorReduceArray = getColorInputValues()
        console.log("Color Reduce Array: ",colorReduceArray)

    // round each index to closest value 
    let roundedArr = sampleValuesArr
    for(let i=0; i<sampleValuesArr.length; i++){
        roundedArr[i] = closestColor(sampleValuesArr[i], colorReduceArray)
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
        // console.log("reducedRgbArr (int): ",reducedRgbArr)
        // console.log("c.data before: ",c.data)    
    c.data = reducedRgbArr
        //console.log("c.data After: ",c.data)    

    // step through the new int vals, overwrite canvas pixels
    for (let y = 0; y < imgHeight; y += 1) { 
        for (let x = 0; x < imgWidth; x += 1) {
            // grab the position/index of the pixel
            let p = (x + (y*imgWidth)) * 4; // (multiply by 4 to skip over the rgba vals) ex: [r,g,b,a, ...]
            let rgbaVal = `rgba( ${reducedRgbArr[p]}, ${reducedRgbArr[p + 1]}, ${reducedRgbArr[p + 2]}, ${reducedRgbArr[p + 3]})`;
            ctx.fillStyle = rgbaVal;

            // draw a block with the rgba value of the first pixel (top-left) in the sample
            ctx.fillRect(x, y, 1, 1);

        }
    }  

    // assign image data to outputImage
    let outputImage = new Image();    
    outputImage.src = c.toDataURL("image/jpeg");  
        //console.log("outpuImg.src: ",outputImage.src)  
    outputImage.classList.add("pixelated"); // add a class name to target elem later to clean dom
    outputImage.width = imgWidth;   

    // append the new image to the dom
    pixelatedImageContainer.append(outputImage);

    // remove loading anim
    //remove(".spinnerElem")
    //btnReduceColors.innerText = "Reduce Colors"

})



// function to select elements by class name
function selectElementsByClass(className){
    return document.querySelectorAll(className)
}

// function to remove elements by class name from dom
function removeByClassName(className){
    document.querySelectorAll(className).forEach(el => el.remove());
}

//btnClearOutput 
document.getElementById("btnClearOutput").addEventListener("click", ()=>{
    //console.log("Button clear output clicked")
    removeByClassName(".pixelated"); // remove all elments with the className: pixelated
})