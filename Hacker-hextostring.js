function hexToString(str)
{
    const buf = new Buffer(str, 'hex');
    return buf.toString('utf8');
}

str = hexToString("48692c2049276d20416c696365")
console.log(str);