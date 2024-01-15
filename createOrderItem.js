//import { kebabCase } from './utils';
import { useStyle } from './src/styles';
import { addLoader, removeLoader } from './loader';
import { deleteOrder } from './deleteOrder';
import { updateOrder } from './updateOrder';

export const createOrderItem = (ticketsCategory, order) => {
  const purchase = document.createElement('div');
  purchase.id = `purchase-${order.ordersId}`;
  purchase.classList.add(...useStyle('purchase'));
  const purchaseTitle = createParagraph(...useStyle('purchaseTitle'));
 purchaseTitle.innerText = (order.event.eventName);
  purchase.appendChild(purchaseTitle);

  const purchaseQuantity = createInput(...useStyle('purchaseQuantity'));
  purchaseQuantity.type = 'number';
  purchaseQuantity.min = '1';
  purchaseQuantity.value = `${order.numberOfTickets}`;
  purchaseQuantity.disabled = true;

  const purchaseQuantityWrapper = createDiv(...useStyle('purchaseQuantityWrapper'));
  purchaseQuantityWrapper.append(purchaseQuantity);
  purchase.appendChild(purchaseQuantityWrapper);

  const purchaseType = createSelect(...useStyle('purchaseType'));
  purchaseType.setAttribute('disabled', 'true');    



// const categoriesOptions = ticketsCategory?.map(
//   (tc) =>
//     `<option class="text-sm font-bold text-black" value=${tc.ticketCategoryId} ${
//       tc.ticketCategoryId === order.ticketCategoryId ? 'selected' : ''
//     }>${tc.ticketsCategory.description}</option>`
// ).join('\n');

// const categoriesOptions= ticketsCategory?.map(tc => {
//   const selectedAttr = tc.ticketCategoryId === selectedCategoryId ? 'selected' : '';
//   const description = tc.description;
//   return `<option class="text-sm font-bold text-black" value="${tc.ticketCategoryId}" ${selectedAttr}>${description}</option>`;
// }).join('\n');
  let ticketCategoryOptions = new Array();
    const buyedOptionString = `<option value=${order.ticketsCategory.ticketCategoryId}>${order.ticketsCategory.description}</option>`;
    ticketCategoryOptions.push(buyedOptionString);
    order.event.listTicketCategory?.map(
    (tc) =>{
      if(tc.ticketCategoryId != order.ticketsCategory.ticketCategoryId){
        const str = `<option value=${tc.ticketCategoryId}>${tc.description}</option>`;
        ticketCategoryOptions.push(str);
      }
    }
    );

    const eventNameWithoutSpaces = order.event.eventName.replace(/\s/g, '');
    const ticketTypeMarkup = `
    <select id="ticketType" name="ticketType" class="select ${eventNameWithoutSpaces}-ticket-type border">
      ${ticketCategoryOptions}
    </select>
    `; 
    purchaseType.innerHTML = ticketTypeMarkup;



//purchaseType.innerHTML = categoriesOptions;
  const purchaseTypeWrapper = createDiv(...useStyle('purchaseTypeWrapper'));
  purchaseTypeWrapper.append(purchaseType);
  purchase.appendChild(purchaseTypeWrapper);
  const purchaseDate = createDiv(...useStyle('purchaseDate'));
  purchaseDate.innerText = new Date(order.timeStamp).toLocaleDateString();
  purchase.appendChild(purchaseDate);
  const purchasePrice = createDiv(...useStyle('purchasePrice'));
  purchasePrice.innerText = order.totalPrice;
  purchase.appendChild(purchasePrice);
  const actions = createDiv(...useStyle('actions'));

  const editButton = createButton([...useStyle(['actionButton', 'editButton'])], '<i class="fa-solid fa-pencil"></i>', editHandler);
  actions.appendChild(editButton);

  const saveButton = createButton([...useStyle(['actionButton', 'hiddenButton', 'saveButton'])], '<i class="fa-solid fa-check"></i>', saveHandler);
  actions.appendChild(saveButton);

  const cancelButton = createButton([...useStyle(['actionButton', 'hiddenButton', 'cancelButton'])], '<i class="fa-solid fa-xmark"></i>', cancelHandler);
  actions.appendChild(cancelButton);

  const deleteButton = createButton([...useStyle(['actionButton', 'deleteButton'])], '<i class="fa-solid fa-trash-can"></i>', deleteHandler);
  actions.appendChild(deleteButton);

  purchase.appendChild(actions);

  function createDiv(...classes) {
    const div = document.createElement('div');
    div.classList.add(...classes);
    return div;
  }

  function createParagraph(...classes) {
    const p = document.createElement('p');
    p.classList.add(...classes);
    return p;
  }

  function createInput(...classes) {
    const input = document.createElement('input');
    input.classList.add(...classes);
    return input;
  }

  function createSelect(...classes) {
    const select = document.createElement('select');
    select.classList.add(...classes);
    return select;
  }

  function createButton(classes, innerHTML, handler) {
    const button = document.createElement('button');
    button.classList.add(...classes);
    button.innerHTML = innerHTML;
    button.addEventListener('click', handler);
    return button;
  }

  function editHandler() {
    if (saveButton.classList.contains('hidden') && cancelButton.classList.contains('hidden')) {
      editButton.classList.add('hidden');
      saveButton.classList.remove('hidden');
      cancelButton.classList.remove('hidden');
      purchaseType.removeAttribute('disabled');
      purchaseQuantity.removeAttribute('disabled');
    }
  }

  function saveHandler() {
    const newType = purchaseType.value;
    const newQuantity = purchaseQuantity.value;
    if (newType != order.ticketCategoryId || newQuantity != order.numberOfTickets.length) {
      addLoader();
      updateOrder(order.ordersId, newType, newQuantity)
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              order = data;
              purchasePrice.innerText = order.totalPrice;
              purchaseDate.innerText = new Date(order.orderedAt).toLocaleDateString();
            });
          }
        })
        .finally(() => {
          setTimeout(() => {
            removeLoader();
          }, 200);
        });
    }

    saveButton.classList.add('hidden');
    cancelButton.classList.add('hidden');
    editButton.classList.remove('hidden');
    purchaseType.setAttribute('disabled', 'true');
    purchaseQuantity.setAttribute('disabled', 'true');
  }

  function cancelHandler() {
    saveButton.classList.add('hidden');
    cancelButton.classList.add('hidden');
    editButton.classList.remove('hidden');
    Array.from(purchaseType.options).forEach(function (element, index) {
      if (element.value == order.ticketsCategory.ticketsCategoryId) {
        purchaseType.options.selectedIndex = index;
        return;
      }
    });
    purchaseQuantity.value = order.numberOfTickets;
    purchaseType.setAttribute('disabled', 'true');
    purchaseQuantity.setAttribute('disabled', 'true');
  }

  function deleteHandler() {
    deleteOrder(order.ordersId);
  }

  return purchase;
};
