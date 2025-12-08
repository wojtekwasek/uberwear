# Dokumentacja backendu

## 1. Instalacja i pierwsze uruchomienie

### 1.1 Instalacja bazy danych

- pobranie xamppa [(Link)](https://www.apachefriends.org/pl/index.html)
- uruchomienie modułów **apache** i **mysql**

### 1.2 Instalacja backendu

- wymagany python (_najlepiej 3.12+_) oraz moduł **venv**
- wykonanie po kolei poleceń w ścieżce docelowej:

```shell
cd uberwear
cd backend
python -m venv venv
venv/Scripts/Activate
pip install fastapi[standard] sqlalchemy pymysql python-jose pyjwt passlib bcrypt
```

- utworzenie pliku o nazwie **.env** w folderze backend
- uzupełnienie konfiguracji w pliku env:

```env
APP_NAME = "UberWear"
DATABASE_URL = "mysql+pymysql://root@localhost/ubrania"
AUTH_SECRET = "123456789"
TOKEN_EXPIRATION_MINUTES = 90
```

- uruchomienie aplikacji

```shell
python -m fastapi dev main.py
```

## 2. Korzystanie z API

### 2.1 Dokumentacja OpenAPI

- można korzystać z automatycznie generowanej dokumentacji OpenAPI w interfejsie pod adresem http://localhost:8000/docs (zależnie od hosta i portu, poprostu dodajemy **/docs** na koniec)
- powinno wyglądać to mniejwięcej tak:
  ![Swagger example](/docs/img/001-docs-example.png)
- każdy kolorowy pasek odpowiada za endpointa API, można go rozwinąć i w prawym górnym rogu "Try it out"
- wtedy wpisujemy w Request Body odpowiednie wartości pól
- po skończeniu wpisywania uruchamiamy zapytanie guzikiem "Execute"

### 2.2 Autoryzacja zapytań

- niektóre endpointy np. **/user/me** na obrazku wyżej mają obok siebie kłódke
- oznacza to że wymagają zalogowania i zastosowania tokenu autoryzującego
- aby zautoryzować sie do wszystkich endpointów na raz, należy:
- 1. wykorzystać endpoint **/login** ze swoimi danymi konta
- 2. po execute zapytania pozyskamy pole **access_token** w odpowiedzi
- 3. będzie to długi ciąg znaków który kopiujemy Ctrl+C
- 4. klikamy guzik "Authorize" w prawym górnym rogu lub kłódkę przy endpoincie
- 5. wklejamy ten długi ciąg znaków (token) do pola które wyskoczy
- 6. potwierdzamy klikając "authorize"
- Po wykonaniu wszystkich kroków powinniśmy móc korzystać z autoryzowanych endpointów, zależnie od uprawnień które są przypisane do naszego konta
