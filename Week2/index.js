'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.send();
    });
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }
  function loadDetail(element) {
    const leftID = document.getElementById('leftID');
    createAndAppend('ul', leftID, { id: 'leftDetailID', class: 'leftDetailClass' });

    const leftDetailID = document.getElementById('leftDetailID');
    createAndAppend('li', leftDetailID, {
      id: 'leftListID',
      class: 'leftListClass',
      text: 'Repository: ',
    });

    const leftListID = document.getElementById('leftListID');
    createAndAppend('a', leftListID, {
      text: element.name,
      href: element.html_url,
      id: 'repositoryNameID',
      class: 'repositoryNameClass',
    });

    createAndAppend('li', leftDetailID, {
      id: 'descList',
      text: `Description:  ${element.description}`,
    });
    createAndAppend('li', leftDetailID, { text: `Forks:  ${element.forks}` });
    const updatedAt = new Date(element.updated_at).toLocaleString();
    createAndAppend('li', leftDetailID, { text: `Updated:  ${updatedAt}` });
  }
  function loadContributor(element) {
    fetchJSON(element.contributors_url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const rightID = document.getElementById('rightID');
        createAndAppend('p', rightID, { id: 'contTextID', text: 'Contributors' });
        createAndAppend('ul', rightID, { id: 'contListID', class: 'contListClass' });

        let contURL;
        let contData;
        let contDetail;
        const contListID = document.getElementById('contListID');
        for (let i = 0; i < data.length; i++) {
          contURL = createAndAppend('a', contListID, {
            href: data[i].html_url,
            target: '_blank',
            id: 'contUrlID',
            class: 'contUrlClass',
          });
          contData = createAndAppend('li', contURL, {
            id: 'contDataID',
            class: 'contDataClass',
          });

          createAndAppend('img', contData, {
            src: data[i].avatar_url,
            id: 'contImgID',
            class: 'contImgClass',
          });

          contDetail = createAndAppend('div', contData, {
            id: 'contDetailID',
            class: 'contDetailClass',
          });
          createAndAppend('div', contDetail, { text: data[i].login });
          createAndAppend('div', contDetail, {
            text: data[i].contributions,
            id: 'contBadgeID',
            class: 'contBadgeClass',
          });
        }
      }
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('header', root, { id: 'topBoxID', class: 'topBoxClass' });
        const topBoxID = document.getElementById('topBoxID');
        createAndAppend('p', topBoxID, {
          id: 'topTextID',
          class: 'topTextClass',
          text: 'HYF Repositories',
        });

        createAndAppend('div', root, { id: 'mainContainerID', class: 'mainContainerClass' });

        const mainContainerID = document.getElementById('mainContainerID');
        createAndAppend('div', mainContainerID, { id: 'leftID', class: 'leftClass' });
        createAndAppend('div', mainContainerID, { id: 'rightID', class: 'rightClass' });
        createAndAppend('select', topBoxID, { id: 'repsSelectID', Class: 'repsSelectClass' });
        data.sort((a, b) => a.name.localeCompare(b.name));

        const repsSelectID = document.getElementById('repsSelectID');
        for (let index = 0; index < data.length; index++) {
          createAndAppend('option', repsSelectID, {
            value: index,
            text: data[index].name,
            id: 'optionID',
            class: 'optionClass',
          });
        }
        const selector = document.getElementById('repsSelectID');

        loadDetail(data[0]);
        loadContributor(data[0]);

        selector.onchange = () => {
          const leftDetail = document.getElementById('leftID');
          leftDetail.parentNode.removeChild(leftDetail);

          const rightDetail = document.getElementById('rightID');
          rightDetail.parentNode.removeChild(rightDetail);

          const i = selector.value;

          createAndAppend('div', mainContainerID, { id: 'leftID', class: 'leftClass' });
          createAndAppend('div', mainContainerID, { id: 'rightID', class: 'rightClass' });
          loadDetail(data[i]);
          loadContributor(data[i]);
        };
      }
    });
  }

  const HYF_REPS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPS_URL);
}
