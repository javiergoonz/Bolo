REM  =====================================================================
REM   PRESENTACIÓN "CONOCIENDO UNA EMPRESA OURENSANA": COREN
REM   Macro para LibreOffice Impress (LibreOffice Basic)
REM
REM   CÓMO USARLA
REM   1. Archivo > Nuevo > Plantillas (Ctrl+Mayús+N) > Presentaciones y
REM      elige una plantilla. Recomendada: "Freshes" (cielo azul con nubes).
REM   2. Con esa presentación abierta: Herramientas > Macros > Editar macros.
REM   3. En "Mis macros y diálogos > Standard > Module1" borra lo que haya,
REM      pega TODO este código y cambia ALUMNO y CURSO (justo debajo).
REM   4. Pon el cursor dentro de "Sub CrearPresentacionCoren" y pulsa F5.
REM   5. Vuelve a la presentación, añade tus imágenes en los recuadros
REM      punteados y guárdala como .odp (Archivo > Guardar como).
REM  =====================================================================

Option Explicit

REM ---------- TUS DATOS (cámbialos) ----------
Const ALUMNO = "Nombre Apellido1 Apellido2"
Const CURSO = "Curso 2026-2027 · 4º ESO"

REM ---------- Variables internas ----------
Private gDoc As Object
Private gColor As Long      ' color principal del elemento gráfico propio
Private gClaro As Long      ' fondo claro de tarjetas
Private gOscuro As Long     ' texto oscuro
Private gGris As Long       ' gris de los huecos de imagen
Private gFuente As String   ' fuente de la plantilla

Sub InicializarColores()
	' Cambia estos valores RGB si quieres otro color para tu diseño
	gColor = RGB(46, 125, 50)       ' verde campo
	gClaro = RGB(232, 243, 233)     ' verde muy claro
	gOscuro = RGB(33, 33, 33)
	gGris = RGB(110, 110, 110)
End Sub

REM =====================================================================
REM   MACRO PRINCIPAL: ejecuta esta
REM =====================================================================
Sub CrearPresentacionCoren()
	Dim oDoc As Object
	oDoc = ThisComponent
	If IsNull(oDoc) Then
		oDoc = StarDesktop.loadComponentFromURL("private:factory/simpress", "_blank", 0, Array())
	ElseIf Not oDoc.supportsService("com.sun.star.presentation.PresentationDocument") Then
		oDoc = StarDesktop.loadComponentFromURL("private:factory/simpress", "_blank", 0, Array())
	End If

	If TieneContenido(oDoc) Then
		If MsgBox("Esta presentación ya tiene contenido." & Chr(10) & _
		          "Se borrarán sus diapositivas para crear la de Coren." & Chr(10) & Chr(10) & _
		          "¿Continuar?", 4 + 32, "Presentación Coren") <> 6 Then Exit Sub
	End If

	ConstruirPresentacion(oDoc)
	MsgBox "¡Presentación creada! (" & oDoc.getDrawPages().getCount() & " diapositivas)" & Chr(10) & Chr(10) & _
	       "Ahora sustituye los recuadros punteados por tus imágenes" & Chr(10) & _
	       "y guarda el archivo como .odp.", 64, "Presentación Coren"
End Sub

Function TieneContenido(oDoc As Object) As Boolean
	Dim oSlide As Object, i As Integer
	If oDoc.getDrawPages().getCount() > 1 Then
		TieneContenido = True
		Exit Function
	End If
	oSlide = oDoc.getDrawPages().getByIndex(0)
	For i = 0 To oSlide.getCount() - 1
		If oSlide.getByIndex(i).String <> "" Then TieneContenido = True
	Next i
End Function

Sub ConstruirPresentacion(oDoc As Object)
	Dim oPages As Object, oSlide As Object, i As Integer
	gDoc = oDoc
	InicializarColores()

	' Dejar solo una diapositiva vacía
	oPages = oDoc.getDrawPages()
	Do While oPages.getCount() > 1
		oPages.remove(oPages.getByIndex(oPages.getCount() - 1))
	Loop
	oSlide = oPages.getByIndex(0)
	Do While oSlide.getCount() > 0
		oSlide.remove(oSlide.getByIndex(0))
	Loop

	DiapoPortada(oSlide)
	ElementoGraficoPropio()
	DiapoIndice()
	DiapoFundador()
	DiapoHistoria()
	DiapoSectorActividad()
	DiapoInstalaciones()
	DiapoMapa()
	DiapoProductos()
	DiapoMarcas()
	DiapoClientes()
	DiapoEmpleados()
	DiapoFacturacion()
	DiapoPresencia()
	DiapoImportancia()
	DiapoSectores()
	DiapoDatoCurioso()
	DiapoValoracion()
	DiapoFuentes()
	DiapoFuentesImagenes()
	DiapoGracias()

	' Transición suave en todas las diapositivas
	For i = 0 To oPages.getCount() - 1
		PonerTransicion(oPages.getByIndex(i))
	Next i
End Sub

REM =====================================================================
REM   DIAPOSITIVAS
REM =====================================================================

Sub DiapoPortada(oSlide As Object)
	Dim oTit As Object, oSub As Object, oImg As Object
	oSlide.Layout = 20
	oSlide.Layout = 0
	oTit = BuscarForma(oSlide, "com.sun.star.presentation.TitleTextShape")
	oSub = BuscarForma(oSlide, "com.sun.star.presentation.SubtitleShape")
	oTit.String = "COREN"
	oSub.String = "Cooperativas Ourensanas" & Chr(10) & ALUMNO & Chr(10) & CURSO
	gFuente = oSub.CharFontName

	' Título y subtítulo a la izquierda, imagen a la derecha
	Dim x As Long, w As Long
	x = oTit.Position.X
	w = oTit.Size.Width
	Colocar(oTit, x, oTit.Position.Y, w * 0.58, oTit.Size.Height)
	Colocar(oSub, x, oSub.Position.Y, w * 0.58, oSub.Size.Height)
	oImg = HuecoImagen(oSlide, x + w * 0.62, oTit.Position.Y, w * 0.38, _
	       oSub.Position.Y + oSub.Size.Height - oTit.Position.Y, _
	       "Foto representativa: logotipo de Coren o sus instalaciones")
	Animar(oImg, com.sun.star.presentation.AnimationEffect.FADE_FROM_RIGHT)
	Notas(oSlide, "Presentarme y decir qué empresa he elegido: Coren, la gran cooperativa agroalimentaria de Ourense.")
End Sub

Sub DiapoIndice()
	Dim oSlide As Object, aSec, i As Integer
	Dim x As Long, y As Long, w As Long, h As Long, cw As Long, ch As Long, gap As Long
	oSlide = NuevaDiapo(19, "Índice")
	aSec = Array("La empresa", "Instalaciones", "Productos y servicios", "Datos de la empresa", _
	             "Importancia para Ourense", "Un dato curioso", "Valoración personal", "Fuentes consultadas")
	ZonaContenido(oSlide, x, y, w, h)
	gap = 400
	cw = (w - gap) / 2
	ch = (h - gap * 3) / 4
	If ch > 2200 Then ch = 2200
	For i = 0 To 7
		TarjetaNumero(oSlide, x + (i \ 4) * (cw + gap), y + (i Mod 4) * (ch + gap), cw, ch, CStr(i + 1), aSec(i))
	Next i
	Notas(oSlide, "Explicar brevemente los apartados del trabajo.")
End Sub

Sub DiapoFundador()
	Dim oSlide As Object
	oSlide = DiapoTextoImagen("La empresa: nombre y fundador", Array( _
		"Nombre: COREN (Cooperativas Ourensanas)", _
		"Fundador: Eulogio Gómez Franqueira", _
		"Nació en 1917 en Xubín (Cenlle, Ourense)", _
		"Maestro rural durante casi 20 años", _
		"Impulsó Coren, UTECO y la Caja Rural", _
		"Diputado por Ourense desde 1977"), _
		"Retrato de Eulogio Gómez Franqueira")
	Notas(oSlide, "Eulogio Gómez Franqueira era maestro rural. Convenció a familias campesinas para unirse en cooperativas y vender juntas su producción.")
End Sub

Sub DiapoHistoria()
	Dim oSlide As Object, aAnio, aTxt, i As Integer, n As Integer
	Dim x As Long, y As Long, w As Long, h As Long, cw As Long, gap As Long, yLin As Long
	Dim oSh As Object, cx As Long
	oSlide = NuevaDiapo(19, "La empresa: breve historia")
	aAnio = Array("1959", "1965", "1975", "1984", "2025")
	aTxt = Array("Unas 20 familias crean las primeras granjas de pollos", _
	             "Primer matadero avícola de la cooperativa", _
	             "Segunda fábrica de piensos en San Cibrao das Viñas", _
	             "Manuel Gómez-Franqueira, hijo del fundador, toma el relevo", _
	             "Récord: unos 1.500 millones de euros de facturación")
	n = 5
	ZonaContenido(oSlide, x, y, w, h)
	gap = 300
	cw = (w - gap * (n - 1)) / n
	yLin = y + 900
	' Línea del tiempo
	oSh = Rect(oSlide, x, yLin - 60, w, 120, gColor)
	For i = 0 To n - 1
		cx = x + i * (cw + gap)
		' Punto sobre la línea
		oSh = Elipse(oSlide, cx + cw / 2 - 350, yLin - 350, 700, 700, gColor)
		oSh.LineStyle = com.sun.star.drawing.LineStyle.SOLID
		oSh.LineColor = RGB(255, 255, 255)
		oSh.LineWidth = 80
		' Tarjeta con año y texto
		oSh = Tarjeta(oSlide, cx, yLin + 700, cw, Minimo(h - 1600, 4200), aAnio(i) & Chr(10) & aTxt(i))
		oSh.TextVerticalAdjust = com.sun.star.drawing.TextVerticalAdjust.TOP
		FormatoParrafos(oSh, 24, 15, gColor)
		Animar(oSh, com.sun.star.presentation.AnimationEffect.FADE_FROM_BOTTOM)
	Next i
	Notas(oSlide, "Coren nació a finales de los años 50 con unas pocas familias y granjas de 5.000 pollos. Hoy es la mayor cooperativa agroalimentaria de España.")
End Sub

Sub DiapoSectorActividad()
	Dim oSlide As Object
	oSlide = DiapoTextoImagen("La empresa: sector, actividad y ubicación", Array( _
		"Sector: agroalimentario y ganadero", _
		"Tipo: cooperativa de cooperativas", _
		"Actividad: carne, huevos y piensos", _
		"Controla todo: de la granja a la tienda", _
		"Sede: Santa Cruz de Arrabaldo (Ourense)", _
		"Piensos: polígono de San Cibrao das Viñas"), _
		"Foto de la sede de Coren en Santa Cruz de Arrabaldo")
	Notas(oSlide, "Coren controla todo el proceso: desde el pienso y la granja hasta el producto que llega al supermercado.")
End Sub

Sub DiapoInstalaciones()
	Dim oSlide As Object
	oSlide = DiapoTextoImagen("Instalaciones", Array( _
		"Más de 20 industrias, todas en Galicia", _
		"Procesado avícola: Santa Cruz de Arrabaldo", _
		"50.000 m² cubiertos y +150 M€ invertidos", _
		"Piensos: 2 fábricas en San Cibrao das Viñas", _
		"Genética avícola: Friol (Lugo)", _
		"Granjas de socios por toda Galicia"), _
		"Foto del Centro de Procesado Avícola de Santa Cruz de Arrabaldo")
	Notas(oSlide, "La mayoría de sus instalaciones están en la provincia de Ourense, muy cerca de la capital.")
End Sub

Sub DiapoMapa()
	Dim oSlide As Object, oImg As Object
	Dim x As Long, y As Long, w As Long, h As Long, gap As Long
	oSlide = NuevaDiapo(19, "Instalaciones: dónde están")
	ZonaContenido(oSlide, x, y, w, h)
	gap = 400
	oImg = HuecoImagen(oSlide, x, y, (w - gap) * 0.6, h, _
	       "MAPA de Ourense marcando Santa Cruz de Arrabaldo y San Cibrao das Viñas" & Chr(10) & _
	       "(captura de OpenStreetMap · © colaboradores de OpenStreetMap)")
	oImg = HuecoImagen(oSlide, x + (w - gap) * 0.6 + gap, y, (w - gap) * 0.4, (h - gap) / 2, _
	       "Foto de una fábrica de piensos de Coren")
	Animar(oImg, com.sun.star.presentation.AnimationEffect.FADE_FROM_RIGHT)
	oImg = HuecoImagen(oSlide, x + (w - gap) * 0.6 + gap, y + (h - gap) / 2 + gap, (w - gap) * 0.4, (h - gap) / 2, _
	       "Foto de una granja de pollos de corral")
	Animar(oImg, com.sun.star.presentation.AnimationEffect.FADE_FROM_RIGHT)
	Notas(oSlide, "Señalar en el mapa la sede de Santa Cruz de Arrabaldo y el polígono de San Cibrao das Viñas.")
End Sub

Sub DiapoProductos()
	Dim oSlide As Object
	oSlide = DiapoTextoImagen("Productos y servicios", Array( _
		"Pollo: de corral, campero y ecológico", _
		"Huevos: de corral, camperos y ecológicos", _
		"Carne: porcino, ternera gallega y pavo", _
		"Elaborados: hamburguesas y fiambres", _
		"Piensos para animales de granja", _
		"+1.700 referencias avícolas"), _
		"Foto de productos Coren en un supermercado")
	Notas(oSlide, "En 2023 la avicultura fue el 35 % de sus ventas, los piensos el 22 % y el porcino el 21 %.")
End Sub

Sub DiapoMarcas()
	Dim oSlide As Object
	oSlide = DiapoTextoImagen("Principales marcas y productos", Array( _
		"Coren: marca principal del grupo", _
		"Pollo de corral: su producto más conocido", _
		"Gama ecológica: pollo y huevos ecológicos", _
		"Ternera Gallega: hamburguesas y carne", _
		"Frigolouro: embutidos y jamones"), _
		"Logotipos o envases de las marcas de Coren")
	Notas(oSlide, "Frigolouro está en O Porriño (Pontevedra) y forma parte del grupo Coren.")
End Sub

Sub DiapoClientes()
	Dim oSlide As Object
	oSlide = DiapoTextoImagen("Clientes y proveedores", Array( _
		"Clientes: supermercados de toda España", _
		"Ej.: El Corte Inglés, Hipercor, Ahorramas", _
		"Hostelería y restaurantes", _
		"Clientes en unos 60 países", _
		"Proveedores: las granjas de los socios", _
		"Socios con pollos, cerdos, vacas y gallinas"), _
		"Foto de una granja de un socio de Coren")
	Notas(oSlide, "Al ser una cooperativa, sus principales proveedores son sus propios socios ganaderos.")
End Sub

Sub DiapoEmpleados()
	Dim oSlide As Object, oSh As Object
	Dim x As Long, y As Long, w As Long, h As Long, cw As Long, gap As Long, th As Long
	oSlide = NuevaDiapo(19, "Datos de la empresa: personas")
	ZonaContenido(oSlide, x, y, w, h)
	gap = 500
	cw = (w - gap * 2) / 3
	th = h * 0.55
	oSh = Dato(oSlide, x, y, cw, th, "≈ 3.500", "puestos de trabajo")
	oSh = Dato(oSlide, x + cw + gap, y, cw, th, "+ 4.000", "socios cooperativistas")
	oSh = Dato(oSlide, x + 2 * (cw + gap), y, cw, th, "+ 20", "industrias en Galicia")
	oSh = Tarjeta(oSlide, x, y + th + gap, w, h - th - gap, _
	      "Coren es una cooperativa: sus dueños son los propios ganaderos." & Chr(10) & _
	      "Fuente: Xunta de Galicia (julio de 2025)")
	FormatoParrafos(oSh, 18, 12, gOscuro)
	Notas(oSlide, "Datos de la visita de la Xunta a Coren en julio de 2025.")
End Sub

Sub DiapoFacturacion()
	Dim oSlide As Object, oBody As Object
	Dim x As Long, y As Long, w As Long, h As Long
	oSlide = DiapoTextoZona("Datos de la empresa: facturación", Array( _
		"2025: récord de unos 1.500 M€ (+9 %)", _
		"2023: 1.127 M€ y 15 M€ de beneficio", _
		"2022: 1.048 M€", _
		"Plan de inversión: 150 M€ hasta 2027"), x, y, w, h)
	GraficoBarras(oSlide, x, y, w, h, Array("2022", "2023", "2025"), Array(1048, 1127, 1500), _
	              Array("1.048", "1.127", "≈1.500"), "Facturación (millones de euros)")
	Notas(oSlide, "La facturación no deja de crecer. En 2025 batió su récord y anunció 150 millones de inversión.")
End Sub

Sub DiapoPresencia()
	Dim oSlide As Object
	oSlide = DiapoTextoImagen("Datos de la empresa: presencia", Array( _
		"Vende en unos 60 países", _
		"Exportación: 35 % de la facturación de carne (2025)", _
		"Mercado principal: España", _
		"Todas sus industrias están en Galicia"), _
		"Mapa del mundo con los países donde vende Coren")
	Notas(oSlide, "Aunque vende por todo el mundo, produce todo en Galicia.")
End Sub

Sub DiapoImportancia()
	Dim oSlide As Object
	oSlide = DiapoTextoImagen("Importancia para Ourense: empleo y economía", Array( _
		"Una de las mayores empresas de Ourense", _
		"Miles de empleos directos e indirectos", _
		"Mantiene población en el rural", _
		"Riqueza local: sus dueños son socios", _
		"Premio Economía de La Región (2024)"), _
		"Foto de trabajadores o de una granja en el rural ourensano")
	Notas(oSlide, "En 2024 el periódico La Región le dio el Premio Economía por su contribución al desarrollo empresarial de Galicia.")
End Sub

Sub DiapoSectores()
	Dim oSlide As Object, oSh As Object, aTxt, i As Integer
	Dim x As Long, y As Long, w As Long, h As Long, cx As Long, cy As Long, r As Long
	Dim tw As Long, th As Long, ang As Double
	oSlide = NuevaDiapo(19, "Importancia: relación con otros sectores")
	ZonaContenido(oSlide, x, y, w, h)
	cx = x + w / 2
	cy = y + h / 2
	r = h * 0.3
	If r > 2200 Then r = 2200
	aTxt = Array("Ganadería: más de 4.000 socios", _
	             "Transporte y logística", _
	             "Cereales y materias primas para piensos", _
	             "Comercio y hostelería", _
	             "Banca: su fundador impulsó la Caja Rural", _
	             "Empleo y vida en el rural")
	tw = w * 0.28
	th = h * 0.2
	' Conectores (detrás)
	For i = 0 To 5
		ang = (i * 60 - 90) * 3.14159265 / 180
		oSh = Linea(oSlide, cx, cy, cx + Cos(ang) * (w * 0.33), cy + Sin(ang) * (h * 0.36))
	Next i
	' Centro
	oSh = Elipse(oSlide, cx - r, cy - r, 2 * r, 2 * r, gColor)
	oSh.String = "COREN"
	Texto(oSh, 22, RGB(255, 255, 255), True)
	' Satélites
	For i = 0 To 5
		ang = (i * 60 - 90) * 3.14159265 / 180
		oSh = Tarjeta(oSlide, cx + Cos(ang) * (w * 0.33) - tw / 2, cy + Sin(ang) * (h * 0.36) - th / 2, tw, th, aTxt(i))
		Texto(oSh, 14, gOscuro, False)
		Animar(oSh, com.sun.star.presentation.AnimationEffect.FADE_FROM_CENTER)
	Next i
	Notas(oSlide, "Coren no solo da trabajo directo: también mueve transportistas, proveedores, comercios y bancos de la provincia.")
End Sub

Sub DiapoDatoCurioso()
	Dim oSlide As Object, oSh As Object
	Dim x As Long, y As Long, w As Long, h As Long, cw As Long, gap As Long, th As Long
	oSlide = NuevaDiapo(19, "Un dato curioso")
	ZonaContenido(oSlide, x, y, w, h)
	gap = 1600
	cw = (w - gap) / 2
	th = h * 0.6
	oSh = Dato(oSlide, x, y, cw, th, "20 familias", "Así empezó todo, con granjas de 5.000 pollos")
	oSh = Flecha(oSlide, x + cw + 250, y + th / 2 - 500, gap - 500, 1000)
	Animar(oSh, com.sun.star.presentation.AnimationEffect.FADE_FROM_LEFT)
	oSh = Dato(oSlide, x + cw + gap, y, cw, th, "1.000.000", "pollos a la semana procesados en Santa Cruz de Arrabaldo (2022)")
	oSh = Tarjeta(oSlide, x, y + th + 400, w, h - th - 400, _
	      "¡De unas pocas granjas a la mayor cooperativa agroalimentaria de España!")
	Texto(oSh, 18, gOscuro, True)
	Animar(oSh, com.sun.star.presentation.AnimationEffect.FADE_FROM_BOTTOM)
	Notas(oSlide, "En 2022 su centro de procesado alcanzó el récord de un millón de pollos a la semana.")
End Sub

Sub DiapoValoracion()
	Dim oSlide As Object
	oSlide = DiapoTextoImagen("Valoración personal", Array( _
		"¿Por qué es importante? Da empleo y mantiene vivo el rural", _
		"Lo más interesante: de 20 familias a 60 países", _
		"¿Trabajaría en ella? Sí, por ejemplo en ..."), _
		"Imagen que represente tu opinión")
	Notas(oSlide, "Adaptar este texto con mi opinión personal.")
End Sub

Sub DiapoFuentes()
	Dim oSlide As Object, oBody As Object
	oSlide = NuevaDiapo(1, "Fuentes consultadas: información")
	oBody = BuscarForma(oSlide, "com.sun.star.presentation.OutlinerShape")
	Vinetas(oBody, Array( _
		"coren.es: historia, industrias y notas de prensa (2025-2026)", _
		"dbe.rah.es: biografía de Eulogio Gómez Franqueira (Real Academia de la Historia)", _
		"campogalego.es: resultados de Coren en 2023", _
		"elcorreogallego.es: récord de facturación de 2025 (julio de 2026)", _
		"xunta.gal: visita de la Xunta a Coren (julio de 2025)", _
		"laregion.es: Premio Economía a Coren (septiembre de 2024)", _
		"avicultura.com: historia e instalaciones de Coren", _
		"agronewscastillayleon.com: récord de un millón de pollos a la semana", _
		"es.wikipedia.org: artículo «Coren»"), 18)
	Notas(oSlide, "Webs consultadas para obtener la información.")
End Sub

Sub DiapoFuentesImagenes()
	Dim oSlide As Object, oBody As Object
	oSlide = NuevaDiapo(1, "Fuentes consultadas: imágenes")
	oBody = BuscarForma(oSlide, "com.sun.star.presentation.OutlinerShape")
	Vinetas(oBody, Array( _
		"Portada: [autor] · [web] · [licencia]", _
		"Fundador: [autor] · [web] · [licencia]", _
		"Instalaciones: [autor] · [web] · [licencia]", _
		"Mapa: © colaboradores de OpenStreetMap (openstreetmap.org)", _
		"Productos: [autor] · [web] · [licencia]", _
		"Gráficos, esquemas y elemento propio: elaboración propia en Impress"), 20)
	Notas(oSlide, "Completar con la procedencia real de cada imagen (Wikimedia Commons, Pixabay, web de Coren...).")
End Sub

Sub DiapoGracias()
	Dim oSlide As Object, oTit As Object, oSub As Object
	oSlide = gDoc.getDrawPages().insertNewByIndex(gDoc.getDrawPages().getCount() - 1)
	oSlide.Layout = 0
	oTit = BuscarForma(oSlide, "com.sun.star.presentation.TitleTextShape")
	oSub = BuscarForma(oSlide, "com.sun.star.presentation.SubtitleShape")
	oTit.String = "¡Gracias!"
	oSub.String = "¿Preguntas?" & Chr(10) & ALUMNO
	Notas(oSlide, "Agradecer la atención y abrir turno de preguntas.")
End Sub

REM =====================================================================
REM   ELEMENTO GRÁFICO PROPIO (se añade al patrón: sale en todas)
REM =====================================================================
Sub ElementoGraficoPropio()
	Dim oMasters As Object, oMaster As Object, i As Integer, j As Integer
	Dim W As Long, H As Long, oBarra As Object, oPildora As Object, oHuevo As Object
	Dim oGrupo As Object, oShapes As Object
	oMasters = gDoc.getMasterPages()
	For i = 0 To oMasters.getCount() - 1
		oMaster = oMasters.getByIndex(i)
		' Borrar uno anterior si se ejecuta la macro otra vez
		For j = oMaster.getCount() - 1 To 0 Step -1
			If oMaster.getByIndex(j).Name = "ElementoPropio" Then oMaster.remove(oMaster.getByIndex(j))
		Next j
		W = oMaster.Width
		H = oMaster.Height
		' Barra fina inferior
		oBarra = Rect(oMaster, 0, H - 150, W, 150, gColor)
		' Etiqueta en forma de píldora con un "huevo" (símbolo avícola)
		oPildora = Rect(oMaster, W - 5600, H - 1050, 5000, 800, gColor)
		oPildora.CornerRadius = 400
		oPildora.String = "COREN · Ourense"
		Texto(oPildora, 11, RGB(255, 255, 255), True)
		oPildora.TextLeftDistance = 700
		oHuevo = Elipse(oMaster, W - 5450, H - 975, 520, 650, RGB(255, 255, 255))
		oHuevo.LineStyle = com.sun.star.drawing.LineStyle.SOLID
		oHuevo.LineColor = gColor
		oHuevo.LineWidth = 60
		oShapes = createUnoService("com.sun.star.drawing.ShapeCollection")
		oShapes.add(oBarra)
		oShapes.add(oPildora)
		oShapes.add(oHuevo)
		oGrupo = oMaster.group(oShapes)
		oGrupo.Name = "ElementoPropio"
	Next i
End Sub

REM =====================================================================
REM   AYUDAS (no hace falta tocarlas)
REM =====================================================================

' Crea una diapositiva al final con un diseño y un título
Function NuevaDiapo(nLayout As Integer, sTitulo As String) As Object
	Dim oPages As Object, oSlide As Object, oTit As Object
	oPages = gDoc.getDrawPages()
	oSlide = oPages.insertNewByIndex(oPages.getCount() - 1)
	oSlide.Layout = nLayout
	oTit = BuscarForma(oSlide, "com.sun.star.presentation.TitleTextShape")
	If Not IsNull(oTit) Then oTit.String = sTitulo
	NuevaDiapo = oSlide
End Function

' Diapositiva con viñetas a la izquierda y hueco de imagen a la derecha
Function DiapoTextoImagen(sTitulo As String, aLineas, sImagen As String) As Object
	Dim oSlide As Object, oImg As Object
	Dim x As Long, y As Long, w As Long, h As Long
	oSlide = DiapoTextoZona(sTitulo, aLineas, x, y, w, h)
	oImg = HuecoImagen(oSlide, x, y, w, h, sImagen)
	DiapoTextoImagen = oSlide
End Function

' Viñetas en el 56 % izquierdo; devuelve la zona libre de la derecha
Function DiapoTextoZona(sTitulo As String, aLineas, x As Long, y As Long, w As Long, h As Long) As Object
	Dim oSlide As Object, oBody As Object, bx As Long, by As Long, bw As Long, bh As Long
	oSlide = NuevaDiapo(1, sTitulo)
	oBody = BuscarForma(oSlide, "com.sun.star.presentation.OutlinerShape")
	bx = oBody.Position.X : by = oBody.Position.Y
	bw = oBody.Size.Width : bh = oBody.Size.Height
	Colocar(oBody, bx, by, bw * 0.56, bh)
	Vinetas(oBody, aLineas)
	x = bx + bw * 0.6
	y = by + 200
	w = bw * 0.4
	h = bh - 400
	DiapoTextoZona = oSlide
End Function

' Zona libre bajo el título (para diapositivas de "solo título")
Sub ZonaContenido(oSlide As Object, x As Long, y As Long, w As Long, h As Long)
	Dim oTit As Object
	oTit = BuscarForma(oSlide, "com.sun.star.presentation.TitleTextShape")
	x = oTit.Position.X
	w = oTit.Size.Width
	y = oTit.Position.Y + oTit.Size.Height + 400
	h = oSlide.Height - y - 1500
End Sub

Function BuscarForma(oSlide As Object, sTipo As String) As Object
	Dim i As Integer, oSh As Object
	For i = 0 To oSlide.getCount() - 1
		oSh = oSlide.getByIndex(i)
		If oSh.getShapeType() = sTipo Then
			BuscarForma = oSh
			Exit Function
		End If
	Next i
End Function

Function Minimo(a As Long, b As Long) As Long
	If a < b Then Minimo = a Else Minimo = b
End Function

Sub Colocar(oSh As Object, x As Long, y As Long, w As Long, h As Long)
	Dim p As New com.sun.star.awt.Point, s As New com.sun.star.awt.Size
	p.X = x : p.Y = y : s.Width = w : s.Height = h
	oSh.Position = p
	oSh.Size = s
End Sub

' Texto con viñetas; lo que va antes de ":" o "?" se pone en negrita
Sub Vinetas(oBody As Object, aLineas, Optional nTamMax)
	Dim nMax As Double
	If IsMissing(nTamMax) Then nMax = 24 Else nMax = nTamMax
	Dim oEnum As Object, oPar As Object, oCur As Object, sTxt As String, n As Integer
	oBody.String = Join(aLineas, Chr(10))
	oBody.TextFitToSize = com.sun.star.drawing.TextFitToSizeType.NONE
	oBody.CharHeight = TamanoQueCabe(aLineas, oBody.Size.Width - 1200, oBody.Size.Height - 400, nMax)
	oEnum = oBody.getText().createEnumeration()
	Do While oEnum.hasMoreElements()
		oPar = oEnum.nextElement()
		sTxt = oPar.getString()
		n = InStr(sTxt, "?")
		If n = 0 Then n = InStr(sTxt, ":")
		If n > 0 And n < 45 Then
			oCur = oBody.getText().createTextCursorByRange(oPar.getStart())
			oCur.goRight(n, True)
			oCur.CharWeight = com.sun.star.awt.FontWeight.BOLD
		End If
	Loop
End Sub

' Elige el tamaño de letra más grande (hasta nMax) con el que el texto cabe
Function TamanoQueCabe(aLineas, nAncho As Long, nAlto As Long, nMax As Double) As Double
	Dim t As Double, i As Integer, nLin As Long, cpl As Double, nNecesario As Double
	t = nMax
	Do While t > 12
		cpl = nAncho / (t * 35.3 * 0.47)
		nLin = 0
		For i = 0 To UBound(aLineas)
			nLin = nLin + Int((Len(aLineas(i)) - 1) / cpl) + 1
		Next i
		nNecesario = nLin * t * 35.3 * 1.25 + (UBound(aLineas) + 1) * t * 35.3 * 0.5
		If nNecesario <= nAlto Then Exit Do
		t = t - 1
	Loop
	TamanoQueCabe = t
End Function

Function Rect(oPage As Object, x As Long, y As Long, w As Long, h As Long, nColor As Long) As Object
	Dim oSh As Object
	' Cuadro de texto con relleno: así el texto se ajusta a su anchura
	oSh = gDoc.createInstance("com.sun.star.drawing.TextShape")
	oPage.add(oSh)
	oSh.TextAutoGrowHeight = False
	oSh.TextAutoGrowWidth = False
	Colocar(oSh, x, y, w, h)
	oSh.TextVerticalAdjust = com.sun.star.drawing.TextVerticalAdjust.CENTER
	oSh.FillStyle = com.sun.star.drawing.FillStyle.SOLID
	oSh.FillColor = nColor
	oSh.LineStyle = com.sun.star.drawing.LineStyle.NONE
	Rect = oSh
End Function

Function Elipse(oPage As Object, x As Long, y As Long, w As Long, h As Long, nColor As Long) As Object
	Dim oSh As Object
	oSh = gDoc.createInstance("com.sun.star.drawing.EllipseShape")
	oPage.add(oSh)
	Colocar(oSh, x, y, w, h)
	oSh.FillStyle = com.sun.star.drawing.FillStyle.SOLID
	oSh.FillColor = nColor
	oSh.LineStyle = com.sun.star.drawing.LineStyle.NONE
	Elipse = oSh
End Function

Function Linea(oPage As Object, x1 As Long, y1 As Long, x2 As Long, y2 As Long) As Object
	Dim oSh As Object, aPts(0) As Variant, aPoly(1) As New com.sun.star.awt.Point
	oSh = gDoc.createInstance("com.sun.star.drawing.PolyLineShape")
	oPage.add(oSh)
	aPoly(0).X = x1 : aPoly(0).Y = y1
	aPoly(1).X = x2 : aPoly(1).Y = y2
	aPts(0) = aPoly()
	oSh.PolyPolygon = aPts()
	oSh.LineColor = gColor
	oSh.LineWidth = 70
	Linea = oSh
End Function

Function Flecha(oPage As Object, x As Long, y As Long, w As Long, h As Long) As Object
	Dim oSh As Object
	oSh = gDoc.createInstance("com.sun.star.drawing.CustomShape")
	oPage.add(oSh)
	Colocar(oSh, x, y, w, h)
	oSh.CustomShapeGeometry = Array(Prop("Type", "right-arrow"))
	oSh.FillStyle = com.sun.star.drawing.FillStyle.SOLID
	oSh.FillColor = gColor
	oSh.LineStyle = com.sun.star.drawing.LineStyle.NONE
	Flecha = oSh
End Function

' Tarjeta clara con texto oscuro (se lee bien sobre cualquier fondo)
Function Tarjeta(oPage As Object, x As Long, y As Long, w As Long, h As Long, sTexto As String) As Object
	Dim oSh As Object
	oSh = Rect(oPage, x, y, w, h, gClaro)
	oSh.CornerRadius = 250
	oSh.LineStyle = com.sun.star.drawing.LineStyle.SOLID
	oSh.LineColor = gColor
	oSh.LineWidth = 40
	oSh.String = sTexto
	oSh.TextLeftDistance = 250 : oSh.TextRightDistance = 250
	oSh.TextUpperDistance = 200 : oSh.TextLowerDistance = 200
	Texto(oSh, 14, gOscuro, False)
	Tarjeta = oSh
End Function

' Tarjeta con número en círculo (índice)
Sub TarjetaNumero(oPage As Object, x As Long, y As Long, w As Long, h As Long, sNum As String, sTexto As String)
	Dim oCard As Object, oCirc As Object, d As Long
	oCard = Tarjeta(oPage, x, y, w, h, sTexto)
	d = h - 300
	If d > 1400 Then d = 1400
	Texto(oCard, 18, gOscuro, False)
	oCard.TextLeftDistance = d + 600
	oCard.ParaAdjust = com.sun.star.style.ParagraphAdjust.LEFT
	oCirc = Elipse(oPage, x + 250, y + (h - d) / 2, d, d, gColor)
	oCirc.String = sNum
	Texto(oCirc, 16, RGB(255, 255, 255), True)
End Sub

' Recuadro de dato destacado: número grande + explicación
Function Dato(oPage As Object, x As Long, y As Long, w As Long, h As Long, sNum As String, sTexto As String) As Object
	Dim oSh As Object
	oSh = Rect(oPage, x, y, w, h, gColor)
	oSh.CornerRadius = 300
	oSh.String = sNum & Chr(10) & sTexto
	oSh.TextLeftDistance = 300 : oSh.TextRightDistance = 300
	Texto(oSh, 14, RGB(255, 255, 255), False)
	FormatoParrafos(oSh, 36, 15, RGB(255, 255, 255))
	Animar(oSh, com.sun.star.presentation.AnimationEffect.FADE_FROM_BOTTOM)
	Dato = oSh
End Function

' Hueco punteado donde pegar una imagen (sustitúyelo por tu foto)
Function HuecoImagen(oPage As Object, x As Long, y As Long, w As Long, h As Long, sTexto As String) As Object
	Dim oSh As Object, d As New com.sun.star.drawing.LineDash
	oSh = Rect(oPage, x, y, w, h, RGB(245, 245, 245))
	d.Style = com.sun.star.drawing.DashStyle.RECT
	d.Dots = 0 : d.Dashes = 1 : d.DashLen = 300 : d.Distance = 200
	oSh.LineStyle = com.sun.star.drawing.LineStyle.DASH
	oSh.LineDash = d
	oSh.LineColor = gGris
	oSh.LineWidth = 50
	oSh.String = "[ IMAGEN ]" & Chr(10) & sTexto
	oSh.TextLeftDistance = 300 : oSh.TextRightDistance = 300
	Texto(oSh, 13, gGris, False)
	FormatoParrafos(oSh, 16, 13, gGris)
	oSh.Name = "Imagen: " & sTexto
	HuecoImagen = oSh
End Function

' Gráfico de barras dibujado con formas
Sub GraficoBarras(oPage As Object, x As Long, y As Long, w As Long, h As Long, aEtiq, aValor, aTexto, sTitulo As String)
	Dim oSh As Object, n As Integer, i As Integer, nMax As Double
	Dim pad As Long, bw As Long, gap As Long, baseY As Long, altoMax As Long, bh As Long, bx As Long
	oSh = Tarjeta(oPage, x, y, w, h, sTitulo)
	oSh.TextVerticalAdjust = com.sun.star.drawing.TextVerticalAdjust.TOP
	Texto(oSh, 13, gOscuro, True)
	n = UBound(aValor) + 1
	nMax = 0
	For i = 0 To n - 1
		If aValor(i) > nMax Then nMax = aValor(i)
	Next i
	pad = 500
	gap = 400
	bw = (w - 2 * pad - gap * (n - 1)) / n
	baseY = y + h - 900
	altoMax = h - 2600
	For i = 0 To n - 1
		bh = altoMax * aValor(i) / nMax
		bx = x + pad + i * (bw + gap)
		oSh = Rect(oPage, bx, baseY - bh, bw, bh, gColor)
		Animar(oSh, com.sun.star.presentation.AnimationEffect.FADE_FROM_BOTTOM)
		oSh = Etiqueta(oPage, bx - 200, baseY - bh - 650, bw + 400, 600, aTexto(i), 14, True)
		oSh = Etiqueta(oPage, bx - 200, baseY + 100, bw + 400, 600, aEtiq(i), 13, False)
	Next i
	oSh = Rect(oPage, x + pad - 200, baseY, w - 2 * pad + 400, 40, gOscuro)
End Sub

Function Etiqueta(oPage As Object, x As Long, y As Long, w As Long, h As Long, sTexto As String, nTam As Double, bNegrita As Boolean) As Object
	Dim oSh As Object
	oSh = gDoc.createInstance("com.sun.star.drawing.TextShape")
	oPage.add(oSh)
	Colocar(oSh, x, y, w, h)
	oSh.TextAutoGrowHeight = False
	oSh.String = sTexto
	Texto(oSh, nTam, gOscuro, bNegrita)
	oSh.TextVerticalAdjust = com.sun.star.drawing.TextVerticalAdjust.CENTER
	Etiqueta = oSh
End Function

Sub Texto(oSh As Object, nTam As Double, nColor As Long, bNegrita As Boolean)
	If gFuente <> "" Then oSh.CharFontName = gFuente
	oSh.CharHeight = nTam
	oSh.CharColor = nColor
	If bNegrita Then
		oSh.CharWeight = com.sun.star.awt.FontWeight.BOLD
	Else
		oSh.CharWeight = com.sun.star.awt.FontWeight.NORMAL
	End If
	oSh.ParaAdjust = com.sun.star.style.ParagraphAdjust.CENTER
	oSh.TextHorizontalAdjust = com.sun.star.drawing.TextHorizontalAdjust.BLOCK
	oSh.TextWordWrap = True
End Sub

' Primer párrafo grande y en negrita, el resto más pequeño
Sub FormatoParrafos(oSh As Object, nGrande As Double, nPeque As Double, nColorPrimero As Long)
	Dim oEnum As Object, oPar As Object, bPrimero As Boolean
	bPrimero = True
	oEnum = oSh.getText().createEnumeration()
	Do While oEnum.hasMoreElements()
		oPar = oEnum.nextElement()
		If bPrimero Then
			oPar.CharHeight = nGrande
			oPar.CharWeight = com.sun.star.awt.FontWeight.BOLD
			oPar.CharColor = nColorPrimero
			bPrimero = False
		Else
			oPar.CharHeight = nPeque
		End If
	Loop
End Sub

Sub Animar(oSh As Object, nEfecto)
	oSh.Effect = nEfecto
	oSh.Speed = com.sun.star.presentation.AnimationSpeed.MEDIUM
End Sub

Sub PonerTransicion(oSlide As Object)
	oSlide.TransitionType = com.sun.star.animations.TransitionType.FADE
	oSlide.TransitionSubtype = com.sun.star.animations.TransitionSubType.CROSSFADE
	oSlide.TransitionDuration = 1.0
End Sub

Sub Notas(oSlide As Object, sTexto As String)
	Dim oNotes As Object, oSh As Object
	oNotes = oSlide.getNotesPage()
	oSh = BuscarForma(oNotes, "com.sun.star.presentation.NotesShape")
	If Not IsNull(oSh) Then oSh.String = sTexto
End Sub

Function Prop(sNombre As String, vValor)
	Dim p As New com.sun.star.beans.PropertyValue
	p.Name = sNombre
	p.Value = vValor
	Prop = p
End Function
