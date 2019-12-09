let itemTypes = ['hats', 'shirts', 'pants', 'accessories'];

let prependToColumn = (item, itemType) => {
    let column = $(`#${itemType}-column-root`);
    let renderedItem = renderItem(item);
    column.prepend(renderedItem);
}

export const renderItem = (dataURL) => {
    return $.parseHTML(`<div class="notification"><img src="${dataURL}" style="border-radius: 5%;"></div>`)[0]
};

export const handleItemUpload = async function (event, itemType) {
    event.preventDefault();

    const files = $(`#upload-${itemType}-file-input`).get(0).files;

    for (let file of files) {

        let fileReader = new FileReader();

        fileReader.onload = async (event) => {

            let dataURL = event.target.result;
            //console.log(dataURL.slice(0, 75))

            const result = await axios({
                method: 'post',
                url: `http://localhost:3000/public/wardrobe/${itemType}/`,
                data: {
                    data: [dataURL],
                    type: 'merge'
                },
            }).then((response) => {
                prependToColumn(dataURL, itemType);
            }).catch((error) => {

            });
        }

        fileReader.readAsDataURL(file);

    }

}

export const getAllItems = async (itemType) => {
    let itemURL = `http://localhost:3000/public/wardrobe/${itemType}`;
    let result = axios({
        method: "get",
        url: itemURL,
    }).then(response => {
        return response.data.result;
    }).catch(error => {
        return [];
    });
    return result;
}

$(async function () {

    for (let itemType of itemTypes) {
        $(`#upload-${itemType}-file-input`).on('input', event => handleItemUpload(event, itemType))
    }

    for (let itemType of itemTypes) {
        let items = await getAllItems(itemType);
        for (let item of items) {
            prependToColumn(item, itemType);
        }
    }
});
