
import $ from 'jquery'

export const delay_to_render = (id,map) => {
    console.log(id," ", "mapa: ",map);
    $(`#${id}`).on('show.bs.modal', function (e) {
        setTimeout(function () {
            map.invalidateSize();
        }, 200);
    });
    /*
    $(`#${id}`).on('hide.bs.modal', function (e) {
        $(this).find('form').trigger('reset');
    });*/

}