export function updateOrder(ordersId, newType, newQuantity) {
   return fetch(`https://localhost:7260/api/Order`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ordersId: +ordersId,
      numberOfTickets: +newQuantity,
      ticketCategoryId: +newType,
    })
  }).then((res) => {
      if (res.status === 200) {
        toastr.success('Success!');
      } else {
        toastr.error('Error!');
      }

      return res;
    })
    .catch((err) => {
      throw new Error(err);
    });
}
