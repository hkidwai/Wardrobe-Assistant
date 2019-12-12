export let itemTypes = ['hats', 'shirts', 'pants', 'accessories'];

let prependToColumn = (dataURL, itemType) => {
    let column = $(`#${itemType}-column-root`);
    let renderedItem = renderItem(dataURL);
    column.prepend(renderedItem);
}

export let replaceItem = (dataURL, itemType) => {
    let item = $(`#${itemType}-item-root`);
    //debugger;
    let renderedSimpleItem = renderSimpleItem(dataURL);
    //alert(renderedItem)
    item.html(renderedSimpleItem);
    //$('body').append(renderedItem)
}

let toggleWeatherProof = async (dataURL, itemType, wasWeatherProof) => {

    let nowWeatherProof = !wasWeatherProof;
    let jwt = localStorage.getItem('jwt');

    // const result = await axios({
    //     method: 'delete',
    //     url: `http://localhost:3000/user/wardrobe/${itemType}/${encodeURI(dataURL)}`,
    //     headers: {
    //         Authorization: `Bearer ${jwt}`
    //     },
    //     /*data: {
    //         data: {
    //             [dataURL]: {
    //                 weatherProof: nowWeatherProof
    //             }
    //         },
    //         type: 'merge'
    //     },*/
    // })

    const result2 = await axios({
        method: 'post',
        url: `http://localhost:3000/user/wardrobe/${itemType}/`,
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        data: {
            data: {
                [dataURL]: {
                    weatherProof: nowWeatherProof
                }
            },
            type: 'merge'
        },
    }).then((response) => {

    }).catch((error) => {

    });

    /*let result = await axios({
        method: "post",
        url: 'http://localhost:3000/user/geolocation/',
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        data: {
            data: {
                latitude: latitude,
                longitude: longitude,
            }
        }
    }).then(async response => {

    }).catch(async error => {

    });*/
}

function itemButtonClick(event) {
    //console.log(event.currentTarget)
    let itemType = $(event.currentTarget).closest('.column-root').get(0).id.slice(0, -12) // slice off '-column-root'
    let wasWeatherProof = $(event.currentTarget).hasClass('is-link')
    if (wasWeatherProof) {
        $(event.currentTarget).removeClass('is-link').addClass('is-warning')
    } else {
        $(event.currentTarget).removeClass('is-warning').addClass('is-link')
    }
    //alert(wasWeatherProof);
    let img = $(event.currentTarget).siblings()[0];
    let src = img.getAttribute('src');

    toggleWeatherProof(src, itemType, wasWeatherProof);
};

let set = new Set();

export const renderSimpleItem = (dataURL) => {
    let html = $.parseHTML(`<div class="notification has-text-centered item-div"><img class="item-image" src="${dataURL}" style="border-radius: 5%;">
    </div>`);
    return html[0];
}
export const renderItem = (dataURL) => {
    //$('body').on('click','.itemButton', editButtonClick);
    //<textarea class="textarea" placeholder="Enter description"></textarea>
    // 
    //$(html).find('.itemButton').on('click', editButtonClick)
    //console.log(html[0])
    if (set.has(dataURL)) {
        return $.parseHTML(``)
    } else {
        set.add(dataURL);
    }


    let html = $.parseHTML(`<div class="notification has-text-centered item-div"><img class="item-image" src="${dataURL}" style="border-radius: 5%;">
    <button class="button item-button is-warning">
        <i class="fas fa-cloud-sun-rain fa-lg fa-fw"></i>
    </button>
    </div>`);
    $(html).find('.item-button').on('click', itemButtonClick)
    //debugger;
    return html[0];
};

export const handleItemUpload = async function (event, itemType) {
    event.preventDefault();

    const files = $(`#upload-${itemType}-file-input`).get(0).files;

    for (let file of files) {

        let fileReader = new FileReader();

        fileReader.onload = async (event) => {

            let dataURL = event.target.result;
            //console.log(dataURL.slice(0, 75))

            let jwt = localStorage.getItem('jwt');
            const result = await axios({
                method: 'post',
                url: `http://localhost:3000/user/wardrobe/${itemType}/`,
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
                data: {
                    //data: [dataURL],
                    data: {
                        [dataURL]: {
                            weatherProof: false
                        }
                    },
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
    let itemURL = `http://localhost:3000/user/wardrobe/${itemType}`;
    let jwt = localStorage.getItem('jwt');
    let result = axios({
        method: "get",
        url: itemURL,
        headers: {
            Authorization: `Bearer ${jwt}`
        },
    }).then(response => {
        //console.log(response.data.result)
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
        let dataURLs = []
        for (let x = 0; x < items.length; x++) {
            //console.log(items[x])
            dataURLs.push(Object.keys(items[x])[0])
        }

        for (let dataURL of dataURLs) {
            prependToColumn(dataURL, itemType);
        }
    }
});
