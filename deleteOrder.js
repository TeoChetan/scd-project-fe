import { addLoader, removeLoader } from './loader';

// export function deleteOrder(ordersId) {
//   addLoader();
//    fetch(`https://localhost:7260/api/Order?Id=${ordersId}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       const purchaseToBeRemoved = document.getElementById(`purchase-${data}`);
//       purchaseToBeRemoved.remove();
//       toastr.success('Success!');
//     })
//     .catch((e) => {
//         console.log(e);
//         toastr.error('Error!');
//     })
//     .finally(()=>{
//     removeLoader()
// });
// }
export function deleteOrder(ordersId) {
    addLoader();
    fetch(`https://localhost:7260/api/Order?Id=${ordersId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
        if (res.status === 204 || res.status === 200) {
          toastr.success('Success!');
          const purchaseToBeRemoved = document.getElementById(`purchase-${ordersId}`);
          if (purchaseToBeRemoved) {
            purchaseToBeRemoved.remove();
          }
        } else {
          toastr.error('Error!');
        }
      })
      .catch((e) => {
        console.log(e);
        toastr.error('Error!');
      })
      .finally(() => {
        removeLoader();
      });
  }