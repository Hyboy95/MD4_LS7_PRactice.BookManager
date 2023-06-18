// function searchKeyWord() {
//     const keywordSearch = document.getElementById('keywordSearch').value;
//     const origin = location.origin;
//     $.ajax({
//         url: `${origin}/search?keyword=${keywordSearch}`,
//         method: 'GET',
//         dataType: "json",
//         contentType: "application/json",
//         success: function (response) {
//             location.reload();
//         }
//     })
// }