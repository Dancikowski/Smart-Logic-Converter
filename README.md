# Small-Logic-Converter
Projekt semestralny z przedmiotu Logika i Teoria Mnogości.

# Cel projektu
Usuwanie znaków równoważności oraz implikacji z formuły klasycznego języka rachunku zdań.

# Zastosowane technologie
- HTML5
- CSS3
- JavaScript

# Działanie aplikacji
0. Program sprawdza poprawność wpisanej formuły.
1. Znajduje główny spójnik i wykonuje przekształcenie.
2. Wyszukuje operacje implikacji lub równoważności zawarte pomiędzy pojedynczymi nawiasami oraz wykonuje przekształcenia.
3. Następnie wykonuje te same operacje na kolejnych poziomach zagłębienia.
4. Algorytm kończy pracę, gdy w formule nie ma już żadnego symbolu implikacji lub równoważności.
5. Opcjonalnie usuwa podwójne negacje.

# Obsługa aplikacji
0. W celu zapisania formuły dozwolone jest użycie:
- małych liter p,q oraz r
- spójników logicznych
    - ∨ (przycisk v)
    - ∧ (przycisk 6 na górnym panelu)
    - ⇒ (przycisk .)
    - ⇔ (przycisk =)
- nawiasów okrągłych
- znaku negacji (przycisk `)

1. Po wpisaniu formuły należy kliknąć zielony button w dolnym panelu aplikacji w celu przetworzenia formuły.
2. Aplikacja posiada żółty przycisk clear służący do wyczyszczenia okna.
3. Aplikacja obsługuje przycisk BackSpace.

## UWAGA! Ze względu na zastosowany algorytm, wpisane formuły muszą być opakowane w nawiasy określające kolejność wykonywania poszczególnych przekształceń.

https://dancikowski.github.io/Logic-Project/

