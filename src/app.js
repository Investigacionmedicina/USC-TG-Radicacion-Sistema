const { useState, useEffect } = React;

// ===== FUNCIONES UTILITARIAS =====
const generarRadicado = (fase) => {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const contador = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `USCTg-${fase}-${año}-${mes}-${contador}`;
};

const esFase1Abierta = () => {
    const ahora = new Date();
    const día = ahora.getDate();
    return día >= 1 && día <= 5;
};

const enviarCorreo = async (destinatario, asunto, contenido) => {
    console.log('📧 Correo enviado a:', destinatario);
    console.log('Asunto:', asunto);
    return true;
};

const descargarExcel = (datos, nombre = 'radicaciones') => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Radicaciones');
    XLSX.writeFile(wb, `${nombre}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// ===== COMPONENTE PRINCIPAL =====
const USCRadicacionApp = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [radicaciones, setRadicaciones] = useState(() => {
        try {
            const saved = localStorage.getItem('usc_radicaciones');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [currentStudent, setCurrentStudent] = useState(null);
    const [currentForm, setCurrentForm] = useState('login');
    const [filtros, setFiltros] = useState({
        fase: 'todas',
        busqueda: ''
    });

    useEffect(() => {
        localStorage.setItem('usc_radicaciones', JSON.stringify(radicaciones));
    }, [radicaciones]);

    // ===== LOGIN =====
    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (email === 'investigacionmedicina@usc.edu.co' && password === 'Investigacion2026$') {
            setUserType('admin');
            setLoggedIn(true);
            setCurrentForm('admin-dashboard');
        } else if (email.endsWith('@usc.edu.co')) {
            setUserType('student');
            setLoggedIn(true);
            setCurrentStudent({ email_inst: email });
            setCurrentForm('student-dashboard');
        } else {
            alert('Email debe ser institucional (@usc.edu.co)');
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUserType(null);
        setEmail('');
        setPassword('');
        setCurrentStudent(null);
        setCurrentForm('login');
    };

    // ===== VISTA LOGIN =====
    if (!loggedIn) {
        return React.createElement(
            'div',
            { style: { background: 'linear-gradient(135deg, #003d82 0%, #1a5f9b 100%)' }, className: 'min-h-screen flex items-center justify-center p-4' },
            React.createElement(
                'div',
                { className: 'bg-white rounded-2xl shadow-2xl w-full max-w-md p-8' },
                React.createElement(
                    'div',
                    { className: 'text-center mb-8' },
                    React.createElement('div', { className: 'w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center' },
                        React.createElement('span', { className: 'text-white font-bold text-xl' }, 'USC')
                    ),
                    React.createElement('h1', { className: 'text-3xl font-bold text-gray-800 mb-2' }, 'Radicación TG'),
                    React.createElement('p', { className: 'text-gray-600 text-sm' }, 'Sistema 2026 - Medicina')
                ),
                React.createElement(
                    'form',
                    { onSubmit: handleLogin, className: 'space-y-4' },
                    React.createElement(
                        'div',
                        {},
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Correo institucional'),
                        React.createElement('input', {
                            type: 'email',
                            value: email,
                            onChange: (e) => setEmail(e.target.value),
                            placeholder: 'tu@usc.edu.co',
                            className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
                        })
                    ),
                    React.createElement(
                        'div',
                        {},
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Contraseña'),
                        React.createElement(
                            'div',
                            { className: 'relative' },
                            React.createElement('input', {
                                type: showPassword ? 'text' : 'password',
                                value: password,
                                onChange: (e) => setPassword(e.target.value),
                                placeholder: '••••••••',
                                className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
                            }),
                            React.createElement('button', {
                                type: 'button',
                                onClick: () => setShowPassword(!showPassword),
                                className: 'absolute right-3 top-2.5 text-gray-500'
                            }, showPassword ? '🙈' : '👁️')
                        )
                    ),
                    React.createElement('button', {
                        type: 'submit',
                        className: 'w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition'
                    }, 'Acceder')
                ),
                React.createElement(
                    'div',
                    { className: 'mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2 text-sm' },
                    React.createElement('p', { className: 'font-semibold text-blue-900' }, '📝 Credenciales:'),
                    React.createElement('p', { className: 'text-blue-800' },
                        React.createElement('strong', {}, 'Coordinadora: '),
                        React.createElement('br', {}),
                        'investigacionmedicina@usc.edu.co',
                        React.createElement('br', {}),
                        'Investigacion2026$'
                    ),
                    React.createElement('p', { className: 'text-blue-800' },
                        React.createElement('strong', {}, 'Estudiante: '),
                        React.createElement('br', {}),
                        'Tu correo @usc.edu.co'
                    )
                )
            )
        );
    }

    // ===== VISTA ESTUDIANTE - DASHBOARD =====
    if (userType === 'student' && currentForm === 'student-dashboard') {
        const estudianteRads = radicaciones.filter(r => 
            r.integrante1?.email_inst === email
        );
        const ultimaRad = estudianteRads[estudianteRads.length - 1];
        const fase1Abierta = esFase1Abierta();

        return React.createElement(
            'div',
            { className: 'min-h-screen bg-gray-50' },
            React.createElement(
                'header',
                { className: 'header-gradient text-white shadow-lg sticky top-0 z-50' },
                React.createElement(
                    'div',
                    { className: 'max-w-6xl mx-auto px-4 py-6 flex justify-between items-center' },
                    React.createElement(
                        'div',
                        {},
                        React.createElement('h1', { className: 'text-2xl font-bold' }, 'Mi Trabajo de Grado'),
                        React.createElement('p', { className: 'text-blue-100 text-sm' }, email)
                    ),
                    React.createElement('button', {
                        onClick: handleLogout,
                        className: 'px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition'
                    }, '🚪 Salir')
                )
            ),
            React.createElement(
                'main',
                { className: 'max-w-6xl mx-auto px-4 py-8' },
                !fase1Abierta && !ultimaRad && React.createElement(
                    'div',
                    { className: 'bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg mb-6' },
                    React.createElement('p', { className: 'font-semibold' }, '⚠️ Fase 1 cerrada'),
                    React.createElement('p', { className: 'text-sm' }, 'Fase 1 solo abre del 1 al 5 de cada mes')
                ),
                React.createElement(
                    'div',
                    { className: 'grid md:grid-cols-3 gap-6 mb-8' },
                    React.createElement(
                        'div',
                        { className: `p-5 rounded-xl border-2 transition ${
                            ultimaRad?.fase1?.estado === 'aprobado' ? 'bg-green-100 border-green-300' :
                            fase1Abierta && !ultimaRad ? 'bg-blue-100 border-blue-300' :
                            'bg-gray-100 border-gray-300'
                        }` },
                        React.createElement('h3', { className: 'font-semibold text-lg mb-2' }, '📄 FASE 1'),
                        React.createElement('p', { className: 'text-xs opacity-90 mb-3' }, 'Solicitud Tutor'),
                        React.createElement(
                            'div',
                            { className: 'text-sm space-y-2' },
                            ultimaRad?.fase1?.estado === 'aprobado' 
                                ? [
                                    React.createElement('p', { className: 'font-medium' }, '✓ APROBADA'),
                                    React.createElement('p', { className: 'text-xs opacity-90' }, 'Tutores asignados')
                                  ]
                                : fase1Abierta && !ultimaRad
                                ? [
                                    React.createElement('p', { className: 'font-medium' }, '⏳ ABIERTA (1-5)'),
                                    React.createElement('p', { className: 'text-xs opacity-90' }, 'Radica ahora')
                                  ]
                                : [
                                    React.createElement('p', { className: 'font-medium' }, '⏳ Pendiente'),
                                    React.createElement('p', { className: 'text-xs opacity-90' }, 'Coordinadora revisa')
                                  ]
                        ),
                        fase1Abierta && !ultimaRad && React.createElement('button', {
                            onClick: () => setCurrentForm('student-fase1'),
                            className: 'mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition font-medium'
                        }, 'RADICAR FASE 1 →')
                    ),
                    React.createElement(
                        'div',
                        { className: `p-5 rounded-xl border-2 transition ${
                            ultimaRad?.fase2?.estado === 'aprobado' ? 'bg-green-100 border-green-300' :
                            ultimaRad?.fase1?.estado === 'aprobado' ? 'bg-blue-100 border-blue-300' :
                            'bg-gray-100 border-gray-300'
                        }` },
                        React.createElement('h3', { className: 'font-semibold text-lg mb-2' }, '📋 FASE 2'),
                        React.createElement('p', { className: 'text-xs opacity-90 mb-3' }, 'Aval Protocolo'),
                        React.createElement(
                            'div',
                            { className: 'text-sm space-y-2' },
                            ultimaRad?.fase1?.estado !== 'aprobado' 
                                ? React.createElement('p', { className: 'opacity-90' }, 'Completa Fase 1')
                                : ultimaRad?.fase2?.estado === 'aprobado'
                                ? [
                                    React.createElement('p', { className: 'font-medium' }, '✓ APROBADA'),
                                    React.createElement('p', { className: 'text-xs opacity-90' }, 'Comité revisó')
                                  ]
                                : [
                                    React.createElement('p', { className: 'font-medium' }, '⏳ Abierta'),
                                    React.createElement('p', { className: 'text-xs opacity-90' }, 'Máx 1 año')
                                  ]
                        ),
                        ultimaRad?.fase1?.estado === 'aprobado' && ultimaRad?.fase2?.estado !== 'aprobado' && React.createElement('button', {
                            onClick: () => setCurrentForm('student-fase2'),
                            className: 'mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition font-medium'
                        }, 'RADICAR FASE 2 →')
                    ),
                    React.createElement(
                        'div',
                        { className: `p-5 rounded-xl border-2 transition ${
                            ultimaRad?.fase3?.estado === 'programada' ? 'bg-green-100 border-green-300' :
                            ultimaRad?.fase2?.estado === 'aprobado' ? 'bg-blue-100 border-blue-300' :
                            'bg-gray-100 border-gray-300'
                        }` },
                        React.createElement('h3', { className: 'font-semibold text-lg mb-2' }, '🎤 FASE 3'),
                        React.createElement('p', { className: 'text-xs opacity-90 mb-3' }, 'Sustentación'),
                        React.createElement(
                            'div',
                            { className: 'text-sm space-y-2' },
                            ultimaRad?.fase2?.estado !== 'aprobado' 
                                ? React.createElement('p', { className: 'opacity-90' }, 'Completa Fase 2')
                                : [
                                    React.createElement('p', { className: 'font-medium' }, '⏳ Abierta'),
                                    React.createElement('p', { className: 'text-xs opacity-90' }, 'Máx 1 año')
                                  ]
                        ),
                        ultimaRad?.fase2?.estado === 'aprobado' && React.createElement('button', {
                            onClick: () => setCurrentForm('student-fase3'),
                            className: 'mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition font-medium'
                        }, 'RADICAR FASE 3 →')
                    )
                ),
                ultimaRad && React.createElement(
                    'div',
                    { className: 'bg-white rounded-xl shadow-md p-6' },
                    React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Radicados'),
                    React.createElement(
                        'div',
                        { className: 'grid md:grid-cols-3 gap-4' },
                        ultimaRad.radicado_f1 && React.createElement(
                            'div',
                            {},
                            React.createElement('p', { className: 'text-sm text-gray-600' }, 'Fase 1'),
                            React.createElement('p', { className: 'font-semibold text-blue-600' }, ultimaRad.radicado_f1)
                        ),
                        ultimaRad.radicado_f2 && React.createElement(
                            'div',
                            {},
                            React.createElement('p', { className: 'text-sm text-gray-600' }, 'Fase 2'),
                            React.createElement('p', { className: 'font-semibold text-blue-600' }, ultimaRad.radicado_f2)
                        ),
                        ultimaRad.radicado_f3 && React.createElement(
                            'div',
                            {},
                            React.createElement('p', { className: 'text-sm text-gray-600' }, 'Fase 3'),
                            React.createElement('p', { className: 'font-semibold text-blue-600' }, ultimaRad.radicado_f3)
                        )
                    )
                )
            )
        );
    }

    // ===== VISTA ESTUDIANTE - FASE 1 =====
    if (userType === 'student' && currentForm === 'student-fase1') {
        const [fase1Data, setFase1Data] = useState({
            integrante1: { nombre: '', cedula: '', email_inst: email, email_pers: '', telefono: '', semestre: '' },
            integrante2: null,
            integrante3: null,
            modalidad: 'Investigación',
            tema: '',
            tiene_tema: true,
            tutor_tematico: { nombre: '', email: '' },
            tutor_metodologico: { nombre: '', email: '' }
        });

        const handleSubmitFase1 = () => {
            if (!fase1Data.integrante1.nombre) { alert('Nombre obligatorio'); return; }
            if (!fase1Data.integrante1.semestre) { alert('Semestre obligatorio'); return; }
            if (fase1Data.tiene_tema && !fase1Data.tema) { alert('Tema obligatorio'); return; }

            const radicadoF1 = generarRadicado('F1');
            const nuevaRad = {
                id: Date.now(),
                radicado_f1: radicadoF1,
                radicado_f2: null,
                radicado_f3: null,
                modalidad: fase1Data.modalidad,
                tema: fase1Data.tema,
                integrante1: fase1Data.integrante1,
                integrante2: fase1Data.integrante2,
                integrante3: fase1Data.integrante3,
                tutor_tematico: fase1Data.tutor_tematico,
                tutor_metodologico: fase1Data.tutor_metodologico,
                fase1: { estado: 'pendiente', fecha: new Date().toLocaleDateString() },
                fase2: { estado: 'no_iniciada' },
                fase3: { estado: 'no_iniciada' }
            };

            setRadicaciones([...radicaciones, nuevaRad]);
            enviarCorreo(email, '✅ Radicación Fase 1', `Radicado: ${radicadoF1}`);
            alert('✅ Radicación Fase 1 exitosa!\n\nRadicado: ' + radicadoF1);
            setCurrentForm('student-dashboard');
        };

        return React.createElement(
            'div',
            { className: 'min-h-screen bg-gray-50' },
            React.createElement(
                'header',
                { className: 'header-gradient text-white shadow-lg' },
                React.createElement(
                    'div',
                    { className: 'max-w-6xl mx-auto px-4 py-6 flex justify-between items-center' },
                    React.createElement('h1', { className: 'text-2xl font-bold' }, 'FASE 1: Solicitud de Tutor'),
                    React.createElement('button', {
                        onClick: () => setCurrentForm('student-dashboard'),
                        className: 'px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg'
                    }, '← ATRÁS')
                )
            ),
            React.createElement(
                'main',
                { className: 'max-w-4xl mx-auto px-4 py-8' },
                React.createElement(
                    'div',
                    { className: 'bg-white rounded-xl shadow-md p-8' },
                    React.createElement('h2', { className: 'text-2xl font-bold mb-6' }, 'Información de Integrantes'),
                    
                    // INTEGRANTE 1
                    React.createElement(
                        'div',
                        { className: 'mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200' },
                        React.createElement('h3', { className: 'text-lg font-semibold mb-4' }, '👤 INTEGRANTE 1 *'),
                        React.createElement(
                            'div',
                            { className: 'grid md:grid-cols-2 gap-4' },
                            React.createElement('input', {
                                type: 'text',
                                placeholder: 'Nombre completo',
                                value: fase1Data.integrante1.nombre,
                                onChange: (e) => setFase1Data({ ...fase1Data, integrante1: { ...fase1Data.integrante1, nombre: e.target.value } }),
                                className: 'px-4 py-2 border border-gray-300 rounded-lg'
                            }),
                            React.createElement('input', {
                                type: 'text',
                                placeholder: 'Cédula',
                                value: fase1Data.integrante1.cedula,
                                onChange: (e) => setFase1Data({ ...fase1Data, integrante1: { ...fase1Data.integrante1, cedula: e.target.value } }),
                                className: 'px-4 py-2 border border-gray-300 rounded-lg'
                            }),
                            React.createElement('input', {
                                type: 'email',
                                placeholder: 'Email institucional',
                                value: fase1Data.integrante1.email_inst,
                                disabled: true,
                                className: 'px-4 py-2 border border-gray-300 rounded-lg bg-gray-100'
                            }),
                            React.createElement('input', {
                                type: 'tel',
                                placeholder: 'Teléfono',
                                value: fase1Data.integrante1.telefono,
                                onChange: (e) => setFase1Data({ ...fase1Data, integrante1: { ...fase1Data.integrante1, telefono: e.target.value } }),
                                className: 'px-4 py-2 border border-gray-300 rounded-lg'
                            }),
                            React.createElement('select', {
                                value: fase1Data.integrante1.semestre,
                                onChange: (e) => setFase1Data({ ...fase1Data, integrante1: { ...fase1Data.integrante1, semestre: e.target.value } }),
                                className: 'px-4 py-2 border border-gray-300 rounded-lg'
                            },
                                React.createElement('option', { value: '' }, 'Selecciona semestre'),
                                [7, 8, 9, 10, 11, 12].map(s => React.createElement('option', { key: s, value: s }, `Semestre ${s}`))
                            )
                        )
                    ),

                    // PROYECTO
                    React.createElement(
                        'div',
                        { className: 'mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200' },
                        React.createElement('h3', { className: 'text-lg font-semibold mb-4' }, '📚 DATOS DEL PROYECTO *'),
                        React.createElement(
                            'div',
                            { className: 'mb-4' },
                            React.createElement('select', {
                                value: fase1Data.modalidad,
                                onChange: (e) => setFase1Data({ ...fase1Data, modalidad: e.target.value }),
                                className: 'w-full px-4 py-2 border border-gray-300 rounded-lg'
                            },
                                React.createElement('option', { value: 'Investigación' }, 'Investigación'),
                                React.createElement('option', { value: 'Monografía' }, 'Monografía'),
                                React.createElement('option', { value: 'Diplomado' }, 'Diplomado')
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'mb-4' },
                            React.createElement('label', { className: 'flex items-center mb-2' },
                                React.createElement('input', {
                                    type: 'radio',
                                    checked: fase1Data.tiene_tema,
                                    onChange: () => setFase1Data({ ...fase1Data, tiene_tema: true }),
                                    className: 'mr-2'
                                }),
                                'Sí, tengo tema definido'
                            ),
                            React.createElement('label', { className: 'flex items-center' },
                                React.createElement('input', {
                                    type: 'radio',
                                    checked: !fase1Data.tiene_tema,
                                    onChange: () => setFase1Data({ ...fase1Data, tiene_tema: false }),
                                    className: 'mr-2'
                                }),
                                'Aún no tengo tema'
                            )
                        ),
                        React.createElement('input', {
                            type: 'text',
                            placeholder: fase1Data.tiene_tema ? 'Tema/Área temática' : '¿Qué área te interesa?',
                            value: fase1Data.tema,
                            onChange: (e) => setFase1Data({ ...fase1Data, tema: e.target.value }),
                            className: 'w-full px-4 py-2 border border-gray-300 rounded-lg'
                        })
                    ),

                    // BOTONES
                    React.createElement(
                        'div',
                        { className: 'flex gap-4' },
                        React.createElement('button', {
                            onClick: () => setCurrentForm('student-dashboard'),
                            className: 'flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold'
                        }, 'CANCELAR'),
                        React.createElement('button', {
                            onClick: handleSubmitFase1,
                            className: 'flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold'
                        }, '✓ ENVIAR RADICACIÓN')
                    )
                )
            )
        );
    }

    // ===== VISTA COORDINADORA - DASHBOARD =====
    if (userType === 'admin' && currentForm === 'admin-dashboard') {
        const [tabActual, setTabActual] = useState('fase1');
        const [filtroBusqueda, setFiltroBusqueda] = useState('');

        const radsFiltradas = radicaciones.filter(r => {
            const cumpleBusqueda = !filtroBusqueda || 
                                 r.integrante1?.nombre?.toLowerCase().includes(filtroBusqueda.toLowerCase());
            return cumpleBusqueda;
        });

        return React.createElement(
            'div',
            { className: 'min-h-screen bg-gray-50' },
            React.createElement(
                'header',
                { className: 'header-gradient text-white shadow-lg sticky top-0 z-50' },
                React.createElement(
                    'div',
                    { className: 'max-w-7xl mx-auto px-4 py-6 flex justify-between items-center' },
                    React.createElement(
                        'div',
                        {},
                        React.createElement('h1', { className: 'text-3xl font-bold' }, 'Panel Coordinadora'),
                        React.createElement('p', { className: 'text-blue-100 text-sm' }, email)
                    ),
                    React.createElement('button', {
                        onClick: handleLogout,
                        className: 'px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition'
                    }, '🚪 Salir')
                )
            ),
            React.createElement(
                'main',
                { className: 'max-w-7xl mx-auto px-4 py-8' },
                React.createElement(
                    'div',
                    { className: 'bg-white rounded-xl shadow-md p-6 mb-8' },
                    React.createElement('h2', { className: 'text-xl font-bold mb-4' }, '🔍 Filtros'),
                    React.createElement(
                        'div',
                        { className: 'grid md:grid-cols-4 gap-4' },
                        React.createElement('input', {
                            type: 'text',
                            placeholder: 'Buscar estudiante...',
                            value: filtroBusqueda,
                            onChange: (e) => setFiltroBusqueda(e.target.value),
                            className: 'px-4 py-2 border border-gray-300 rounded-lg'
                        }),
                        React.createElement('button', {
                            onClick: () => descargarExcel(radsFiltradas, `Radicaciones_${tabActual}`),
                            className: 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold'
                        }, '📥 Descargar Excel')
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'bg-white rounded-xl shadow-md p-6 mb-8' },
                    React.createElement(
                        'div',
                        { className: 'flex gap-2 border-b mb-6' },
                        React.createElement('button', {
                            onClick: () => setTabActual('fase1'),
                            className: `px-6 py-3 font-semibold ${tabActual === 'fase1' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`
                        }, 'FASE 1'),
                        React.createElement('button', {
                            onClick: () => setTabActual('fase2'),
                            className: `px-6 py-3 font-semibold ${tabActual === 'fase2' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`
                        }, 'FASE 2'),
                        React.createElement('button', {
                            onClick: () => setTabActual('fase3'),
                            className: `px-6 py-3 font-semibold ${tabActual === 'fase3' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`
                        }, 'FASE 3')
                    ),
                    React.createElement(
                        'div',
                        { className: 'overflow-x-auto' },
                        React.createElement(
                            'table',
                            { className: 'w-full text-sm' },
                            React.createElement(
                                'thead',
                                { className: 'bg-gray-100 border-b' },
                                React.createElement(
                                    'tr',
                                    {},
                                    React.createElement('th', { className: 'px-4 py-3 text-left' }, 'Radicado'),
                                    React.createElement('th', { className: 'px-4 py-3 text-left' }, 'Estudiante'),
                                    React.createElement('th', { className: 'px-4 py-3 text-left' }, 'Email'),
                                    React.createElement('th', { className: 'px-4 py-3 text-left' }, 'Modalidad'),
                                    React.createElement('th', { className: 'px-4 py-3 text-left' }, 'Estado'),
                                    React.createElement('th', { className: 'px-4 py-3 text-center' }, 'Acción')
                                )
                            ),
                            React.createElement(
                                'tbody',
                                {},
                                radsFiltradas.map((rad) => {
                                    const radicado = tabActual === 'fase1' ? rad.radicado_f1 : tabActual === 'fase2' ? rad.radicado_f2 : rad.radicado_f3;
                                    const estado = rad[`fase${tabActual.replace('fase', '')}`]?.estado;

                                    return React.createElement(
                                        'tr',
                                        { key: rad.id, className: 'border-b hover:bg-gray-50' },
                                        React.createElement('td', { className: 'px-4 py-3 font-semibold' }, radicado),
                                        React.createElement('td', { className: 'px-4 py-3' }, rad.integrante1?.nombre),
                                        React.createElement('td', { className: 'px-4 py-3' }, rad.integrante1?.email_inst),
                                        React.createElement('td', { className: 'px-4 py-3' }, rad.modalidad),
                                        React.createElement('td', { className: 'px-4 py-3' },
                                            React.createElement('span', { className: `px-2 py-1 rounded text-xs font-semibold ${
                                                estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                                                estado === 'rechazado' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }` },
                                                estado === 'aprobado' ? '✓ Aprobado' : estado === 'rechazado' ? '❌ Rechazado' : '⏳ Pendiente'
                                            )
                                        ),
                                        React.createElement('td', { className: 'px-4 py-3 text-center' },
                                            estado !== 'aprobado' && React.createElement('button', {
                                                onClick: () => {
                                                    const nuevasRads = radicaciones.map(r => 
                                                        r.id === rad.id 
                                                            ? {
                                                                ...r,
                                                                [`` + `fase${tabActual.replace('fase', '')}`]: { ...r[`fase${tabActual.replace('fase', '')}`], estado: 'aprobado' }
                                                              }
                                                            : r
                                                    );
                                                    setRadicaciones(nuevasRads);
                                                    enviarCorreo(rad.integrante1.email_inst, '✅ Fase aprobada', 'Tu radicación ha sido aprobada');
                                                    alert('✓ Aprobado');
                                                },
                                                className: 'px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition'
                                            }, 'Aprobar')
                                        )
                                    );
                                })
                            )
                        )
                    ),
                    radsFiltradas.length === 0 && React.createElement('p', { className: 'text-center text-gray-600 py-8' }, 'Sin radicaciones')
                )
            )
        );
    }

    return null;
};

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(USCRadicacionApp));
