export const renderHats = function (event) {
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
    //console.log(files)

    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        let file = files[i]
        formData.append(`files[${i}]`, file);
    }
    //console.log(...formData)

    const result = await axios({
      method: 'post',
      data: {
          data: formData
      },
      url: 'http://localhost:3000/public/clothes/',
      
    }).then((response) => {

    }).catch((error) => {

    });
    
    let currentID = $(event.currentTarget).closest("#shirtBar")

}


$(function () {
    $('#UploadShirt').on('click', handleShirtUpload);



});