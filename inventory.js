export const renderHats = function (event) {

};
export const renderShirt = (dataURL) => {
    return $.parseHTML(`<img src="${dataURL}" style="border-radius: 5%;">`)[0]
};
export const renderShirts = function (event) {

};
export const renderPants = function (event) {

};
export const renderAccessories = function (event) {

};

export const handleShirtUpload = async function (event) {
    event.preventDefault();

    const files = document.querySelector('[type=file]').files;
    let fileReader = new FileReader();
    
    fileReader.onload = async (event) => {

        let dataURL = event.target.result;
        
        const result = await axios({
            method: 'post',
            url: 'http://localhost:3000/public/clothes/',
            data: {
                data: [dataURL]
            },

        }).then((response) => {
            let shirtBar = $(`#shirtBar`);
            let renderedShirt = renderShirt(dataURL);
            shirtBar.append(renderedShirt);
        }).catch((error) => {
            
        });
    }
    for (let file of files) {
        fileReader.readAsDataURL(file);
    }

}


$(function () {
    let preventDefault = (event) => {
        event.preventDefault();
    }
    let uploadShirtsForm = $('#upload-shirts-form')
    uploadShirtsForm.on('submit', preventDefault);

    $('#upload-shirts-button').on('click', handleShirtUpload);
});
