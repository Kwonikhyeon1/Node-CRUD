fetch('http://www.omdbapi.com/?apikey=7035c60c&s=avengers', {
    method: 'GET',
    headers: {},
    body:{}
})
.then(res => res.json())
.then(json => console.log(json))

const wrap = async () => {
    const res = await fetch('http://www.omdbapi.com/?apikey=7035c60c&s=avengers')
    const json = await res.json()
    console.log(json)
}
wrap();