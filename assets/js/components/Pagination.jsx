import React from 'react';

const Pagination = (props) => {
	const { currentPage, itemsPerPage, size, onChangePagination } = props;

	const countPages = Math.ceil(size / itemsPerPage);
	const pages = [];

	for (let i = 1; i < countPages; i++) {
		pages.push(i);
	}

	return (
		<div>
			<ul className="pagination pagination-sm">
				<li className={'page-item' + (1 === currentPage && ' disabled')}>
					<button className="page-link" onClick={() => onChangePagination(currentPage - 1)}>
						&laquo;
					</button>
				</li>
				{pages.map((page) => (
					<li key={page} className={'page-item' + (page === currentPage && ' active')}>
						<button className="page-link" onClick={() => onChangePagination(page)}>
							{page}
						</button>
					</li>
				))}
				<li className={'page-item' + (pages.length === currentPage && ' disabled')}>
					<button className="page-link" onClick={() => onChangePagination(currentPage + 1)}>
						&raquo;
					</button>
				</li>
			</ul>
		</div>
	);
};

Pagination.getData = (currentPage, itemsPerPage, items) => {
	const start = currentPage * itemsPerPage - itemsPerPage;
	return items.slice(start, start + itemsPerPage);
};

export default Pagination;
