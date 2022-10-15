// styles
import './style.css'
import catsImgStyles from './catsImgStyles.module.css'
// APIs
const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=5'
const API_URL_FAVOTITES = 'https://api.thecatapi.com/v1/favourites'
const API_URL_FAVOTITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload'
// svg
const svgHeart = `
		<svg width="32" height="32" filter="drop-shadow(3px 3px 10px rgb(0 0 0 / 1))"  viewBox="0 0 24 24" fill="rgba(255, 255, 255, .5)  ">
							<path
								d="M7.5 2.25C10.5 2.25 12 4.25 12 4.25C12 4.25 13.5 2.25 16.5 2.25C20 2.25 22.5 4.99999 22.5 8.5C22.5 12.5 19.2311 16.0657 16.25 18.75C14.4095 20.4072 13 21.5 12 21.5C11 21.5 9.55051 20.3989 7.75 18.75C4.81949 16.0662 1.5 12.5 1.5 8.5C1.5 4.99999 4 2.25 7.5 2.25Z"
							></path>
						</svg>
`
// getElements
const contentFavotites = document.getElementById('contentFavotites')
const contentCatsRandom = document.getElementById('contentCatsRandom')
const spanError = document.getElementById('error')
const reload = document.getElementById('reload')
const upload = document.getElementById('upload')
const imagePreview = document.getElementById('image-preview')

// reload cats container whit button

loadRandomMichis()
loadFavoritesMichis()

reload.addEventListener('click', loadRandomMichis)
upload.addEventListener('click', uploadMichiPhoto)

/* *** whith Fetch{
	fetch(URL)
	.then((res) => res.json())
	.then((data) => {
		const img = document.querySelector('img')
		img.src = data[0].url
		reset()
	})
}
*/

async function loadRandomMichis() {
	const res = await fetch(API_URL_RANDOM)
	const data = await res.json()
	if (res.status !== 200) {
		spanError.innerHTML = 'Hubo un error: ' + res.status
	} else {
		contentCatsRandom.innerHTML = ' '
		await data.forEach(async (michi) => {
			await createElements(michi)
		})
		await isLoaded()
	}
}

async function loadFavoritesMichis() {
	const res = await fetch(API_URL_FAVOTITES, {
		method: 'GET',
		headers: {
			'X-API-KEY': 'live_ulJudOIXT5dlxLgJGc39S45lE1McfpaUc95SONW4EKa4XotzFg7RKqf4jcpcI33p',
		},
	})
	const data = await res.json()
	if (res.status !== 200) {
		spanError.innerHTML = 'Hubo un error: ' + res.status
	} else {
		contentFavotites.innerHTML = ''
		data.forEach((michi) => {
			createElements(michi)
		})
	}
}
async function createElements(michi) {
	const isFavorites = michi.hasOwnProperty('image')
	let { id, url } = michi
	const article = document.createElement('article')
	const btn = document.createElement('button')
	const img = document.createElement('img')
	//add structure
	article.appendChild(img)
	article.appendChild(btn)
	img.src = url
	btn.innerHTML = svgHeart

	if (isFavorites) {
		contentFavotites.appendChild(article)
		img.src = michi.image.url
		btn.children[0].setAttribute('fill', '#e22348')
		btn.onclick = (svg) => {
			svg.path[1].setAttribute('fill', 'rgba(255, 255, 255, .5)')
			deleteFavoriteMichis(`${michi.id}`)
		}
	} else {
		contentCatsRandom.appendChild(article)
		btn.onclick = (svg) => {
			svg.path[1].setAttribute('fill', '#e22348')
			saveFavoriteMichi(`${id}`)
		}
	}
	//styles
	img.classList.add(catsImgStyles.imgCats)
	btn.classList.add(catsImgStyles.buttonHeart)
	article.classList.add(catsImgStyles.articleCats)
}
async function isLoaded() {
	const preloader = document.getElementById('preloader')
	const contentImages = contentCatsRandom.querySelectorAll('img')
	const lastImage = contentImages[contentImages.length - 1]
	preloader.classList.remove('hidden')

	lastImage.addEventListener('load', () => {
		setTimeout(() => {
			preloader.classList.add('hidden')
		}, 1000)
	})
}

async function saveFavoriteMichi(id) {
	const res = await fetch(API_URL_FAVOTITES, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': 'live_ulJudOIXT5dlxLgJGc39S45lE1McfpaUc95SONW4EKa4XotzFg7RKqf4jcpcI33p',
		},
		body: JSON.stringify({
			image_id: id,
		}),
	})
	const data = await res.json()
	if (res.status !== 200) {
		spanError.innerHTML = 'Hubo un error: ' + res.status
	} else {
		console.log('Save michi')
		loadFavoritesMichis()
	}
}
async function deleteFavoriteMichis(id) {
	const res = await fetch(API_URL_FAVOTITES_DELETE(id), {
		method: 'DELETE',
		headers: {
			'X-API-KEY': 'live_ulJudOIXT5dlxLgJGc39S45lE1McfpaUc95SONW4EKa4XotzFg7RKqf4jcpcI33p',
		},
	})
	const data = await res.json()
	if (res.status !== 200) {
		spanError.innerHTML = 'Hubo un error: ' + res.status
	} else {
		console.log('Delete michi')
		loadFavoritesMichis()
	}
}
async function uploadMichiPhoto() {
	const form = document.getElementById('uploadingForm')
	const formData = new FormData(form)
	console.log(formData.get('file'))
	const res = await fetch(API_URL_UPLOAD, {
		method: 'POST',
		headers: {
			'X-API-KEY': 'live_ulJudOIXT5dlxLgJGc39S45lE1McfpaUc95SONW4EKa4XotzFg7RKqf4jcpcI33p',
		},
		body: formData,
	})
	const data = await res.json()
	if (res.status !== 201) {
		spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`
	} else {
		console.log('Foto de michi cargada :)')
		imagePreview.src = ''
		saveFavoriteMichi(data.id)
	}
}
