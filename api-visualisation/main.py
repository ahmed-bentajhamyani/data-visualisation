from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from visualisation.pub_par_annee import get_pub_par_anne
from visualisation.pub_par_mois import get_pub_par_mois
from visualisation.pub_par_country import get_pub_par_country
from visualisation.pub_par_univ import get_pub_par_univ
from visualisation.pub_par_keyword import get_pub_par_keyword
from visualisation.pub_par_quartile import get_pub_par_quartile
from visualisation.pub_par_quartile_annee import get_pub_par_quartile_annee
from visualisation.pub_par_country_quartile import get_pub_par_pays_et_quartile
from visualisation.countries import getAllCountries


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/countries")
async def getCountries():
    return getAllCountries()


@app.get("/publications-par-annee")
async def annee():
    publications_par_anne = get_pub_par_anne()
    return publications_par_anne


@app.get("/publications-par-mois")
async def mois():
    publications_par_anne = get_pub_par_mois()
    return publications_par_anne


@app.get("/publications-par-pays")
async def pays():
    publications_par_anne = get_pub_par_country()
    return publications_par_anne


@app.get("/publications-par-universite")
async def univ():
    publications_par_univ = get_pub_par_univ()
    return publications_par_univ


@app.get("/publications-par-keyword")
async def keyword():
    publications_par_keyword = get_pub_par_keyword()
    return publications_par_keyword


@app.get("/publications-par-quartile")
async def quartile():
    publications = get_pub_par_quartile()
    return publications


@app.get("/publications/{country}")
async def publications_par_quartile_annee(country: str):
    publications = get_pub_par_quartile_annee(country)
    return publications


@app.get("/publications")
async def publications_par_quartile_country():
    publications = get_pub_par_pays_et_quartile()
    return publications
